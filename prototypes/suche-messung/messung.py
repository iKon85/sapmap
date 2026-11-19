"""Suche über 154 Steckbriefe (Wegwerfcode, Ticket #17): reicht Volltext, oder lohnen Embeddings?

Varianten
  c0  heutige Seite (Teilstring, alle Wörter, keine Rangfolge)       -> client.mjs
  c1  MiniSearch im Browser (Präfix, Tippfehlertoleranz, Gewichte)  -> client.mjs
  p1  Postgres ts_rank_cd, Konfiguration german, gewichtete Felder, Aliasspalte (simple + german)
  p2  BM25 per pg_textsearch, german, Name und aka wiederholt
  p3  p2 + pg_trgm-Ähnlichkeit auf der Aliasspalte (RRF)
  e1  BGE-M3 dense allein (pgvector, exakt)
  h1  p2 + e1 (RRF)          entspricht Variante j aus Activate #31
  h2  p3 + e1 (RRF)

Aufruf (Postgres aus dem Image activate-pg:17-ts auf Port 55433, siehe README.md):
  uv run --no-project --python 3.12 --with sentence-transformers --with torch \
     --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match \
     --with 'psycopg[binary]' --with numpy --with psutil python messung.py
"""
import json
import os
import re
import resource
import time
from collections import defaultdict
from pathlib import Path

import numpy as np
import psycopg

HIER = Path(__file__).parent
ERG = HIER / "erg"
DATA = json.loads((HIER / "../../data/steckbriefe.json").read_text())
ANFR = json.loads((HIER / "anfragen.json").read_text())
DSN = os.environ.get("DSN", "postgresql://postgres:lokal@localhost:55433/postgres")
RRF_K = 60
TOP = 20


def alias(d):
    return " ; ".join([d["name"], *d.get("aka", []), d["id"].replace("-", " ")])


def body(d):
    return " ".join(str(d.get(f, "")) for f in ["was", "wie", "s4", "wann"])


def rest(d):
    return " ".join([d.get("lizenz", ""), d.get("statusText", ""), d.get("test", ""),
                     " ".join(x.get("text", "") for x in d.get("daten", []))])


def emb_text(d):
    return ". ".join([d["name"], "; ".join(d.get("aka", [])), d["kurz"], body(d)])


def rrf(*listen, n=TOP):
    s = defaultdict(float)
    for liste in listen:
        for rang, i in enumerate(liste):
            s[i] += 1 / (RRF_K + rang + 1)
    return [i for i, _ in sorted(s.items(), key=lambda x: -x[1])][:n]


def laden(c, vek):
    c.execute("drop table if exists s")
    c.execute("""create table s (id text primary key, alias text, kurz text, body text, rest text,
                 tsv tsvector, bm text, e vector(1024))""")
    for d, v in zip(DATA, vek):
        a = alias(d)
        c.execute("insert into s (id, alias, kurz, body, rest, bm, e) values (%s,%s,%s,%s,%s,%s,%s)",
                  (d["id"], a, d["kurz"], body(d), rest(d),
                   # BM25 kennt nur eine Spalte: Alias 3x, kurz 2x als Ersatz für Gewichte (wie Activate #31)
                   " ".join([a, a, a, d["kurz"], d["kurz"], body(d), rest(d)]),
                   "[" + ",".join(f"{x:.6f}" for x in v) + "]"))
    c.execute("""update s set tsv = setweight(to_tsvector('simple', alias), 'A') || setweight(to_tsvector('german', alias), 'A')
                 || setweight(to_tsvector('german', kurz), 'B') || setweight(to_tsvector('german', body), 'C')
                 || setweight(to_tsvector('german', rest), 'D')""")
    c.execute("create index s_tsv on s using gin (tsv)")
    c.execute("create index s_bm on s using bm25 (bm) with (text_config = 'german')")
    c.execute("create index s_trgm on s using gin (alias gin_trgm_ops)")


def tsq_oder(c, q):
    """Freitext -> ODER-tsquery (german und simple), damit ganze Sätze nicht an UND scheitern."""
    r = c.execute("""select nullif(replace(websearch_to_tsquery('german', %s)::text, '&', '|'), ''),
                            nullif(replace(websearch_to_tsquery('simple', %s)::text, '&', '|'), '')""", (q, q)).fetchone()
    teile = [f"({x})" for x in r if x]
    return " | ".join(teile) if teile else None


def p1(c, q):
    tq = tsq_oder(c, q)
    if not tq:
        return []
    return [r[0] for r in c.execute("""select id from s where tsv @@ %s::tsquery
              order by ts_rank_cd(tsv, %s::tsquery) desc, id limit %s""", (tq, tq, TOP))]


def p2(c, q):
    return [r[0] for r in c.execute("""select id from (select id, bm <@> to_bm25query(%s, 's_bm') sc from s) x
              where sc < 0 order by sc, id limit %s""", (q, TOP))]


def trgm(c, q):
    return [r[0] for r in c.execute("""select id from s where %s <%% alias
              order by word_similarity(%s, alias) desc, id limit %s""", (q, q, TOP))]


def e1(c, v):
    lit = "[" + ",".join(f"{x:.6f}" for x in v) + "]"
    return [r[0] for r in c.execute("select id from s order by e <=> %s::vector limit %s", (lit, TOP))]


def kennzahlen(ergebnis, varianten):
    zeilen = {}
    typen = sorted({a["typ"] for a in ANFR}, key=lambda t: ["name", "alias", "umschreibend", "frage", "englisch", "tippfehler"].index(t))
    for v in varianten:
        je_typ = {}
        for t in typen + ["alle"]:
            A = [a for a in ANFR if t == "alle" or a["typ"] == t]
            h1 = h5 = mrr = leer = 0
            for a in A:
                liste = ergebnis[v][a["q"]][:10]
                rang = next((i for i, x in enumerate(liste) if x in a["ziel"]), None)
                h1 += rang == 0
                h5 += rang is not None and rang < 5
                mrr += 1 / (rang + 1) if rang is not None else 0
                leer += not ergebnis[v][a["q"]]
            je_typ[t] = {"n": len(A), "t1": h1, "t5": h5, "mrr": round(mrr / len(A), 2), "leer": leer}
        zeilen[v] = je_typ
    return zeilen, typen


def main():
    ERG.mkdir(exist_ok=True)
    from sentence_transformers import SentenceTransformer
    import torch
    torch.set_num_threads(8)
    t = time.time()
    m = SentenceTransformer("BAAI/bge-m3", device="cpu")
    zeit = {"modell_laden_s": round(time.time() - t, 1)}
    t = time.time()
    vek = m.encode([emb_text(d) for d in DATA], normalize_embeddings=True, batch_size=8)
    zeit["einbetten_154_s"] = round(time.time() - t, 1)
    tok = m.tokenizer
    laengen = [len(tok(emb_text(d))["input_ids"]) for d in DATA]
    zeit["tokens_je_steckbrief_max"] = max(laengen)
    zeit["tokens_je_steckbrief_median"] = int(np.median(laengen))
    t = time.time()
    qv = m.encode([a["q"] for a in ANFR], normalize_embeddings=True, batch_size=1)
    zeit["einbetten_anfrage_ms"] = round((time.time() - t) / len(ANFR) * 1000, 1)
    zeit["max_rss_mb"] = round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024)

    erg = json.loads((ERG / "client.json").read_text())
    zeit["client"] = erg.pop("_zeit_ms_je_anfrage")
    zeit["json_bytes"] = erg.pop("_json_bytes")
    with psycopg.connect(DSN, autocommit=True) as c:
        laden(c, vek)
        for k in ["p1", "p2", "p3", "e1", "h1", "h2"]:
            erg[k] = {}
        dauer = defaultdict(float)
        for a, v in zip(ANFR, qv):
            q = a["q"]
            for k, f in [("p1", lambda: p1(c, q)), ("p2", lambda: p2(c, q)), ("tg", lambda: trgm(c, q)), ("e1", lambda: e1(c, v))]:
                s = time.time(); erg.setdefault(k, {})[q] = f(); dauer[k] += time.time() - s
            erg["p3"][q] = rrf(erg["p2"][q], erg["tg"][q])
            erg["h1"][q] = rrf(erg["p2"][q], erg["e1"][q])
            erg["h2"][q] = rrf(erg["p3"][q], erg["e1"][q])
        zeit["postgres_ms_je_anfrage"] = {k: round(x / len(ANFR) * 1000, 2) for k, x in dauer.items()}
    erg.pop("tg")

    varianten = ["c0", "c1", "p1", "p2", "p3", "e1", "h1", "h2"]
    kz, typen = kennzahlen(erg, varianten)
    (ERG / "listen.json").write_text(json.dumps(erg, ensure_ascii=False, indent=1))
    (ERG / "kennzahlen.json").write_text(json.dumps({"kennzahlen": kz, "betrieb": zeit}, ensure_ascii=False, indent=1))

    # Bericht als Markdown
    out = ["## Treffer@1 / Treffer@5 je Anfragetyp (Anzahl Anfragen)", "",
           "| Variante | " + " | ".join(f"{t} ({kz['c0'][t]['n']})" for t in typen) + f" | alle ({len(ANFR)}) | MRR@10 | leer |",
           "|---|" + "---|" * (len(typen) + 3)]
    for v in varianten:
        z = kz[v]
        out.append(f"| {v} | " + " | ".join(f"{z[t]['t1']} / {z[t]['t5']}" for t in typen)
                   + f" | **{z['alle']['t1']} / {z['alle']['t5']}** | {z['alle']['mrr']} | {z['alle']['leer']} |")
    out += ["", "## Anfragen, bei denen die Varianten auseinanderlaufen (Rang des ersten erwarteten Treffers, – = nicht in Top 10)", "",
            "| Anfrage | Typ | erwartet | " + " | ".join(varianten) + " |", "|---|---|---|" + "---|" * len(varianten)]
    for a in ANFR:
        r = []
        for v in varianten:
            liste = erg[v][a["q"]][:10]
            rang = next((i for i, x in enumerate(liste) if x in a["ziel"]), None)
            r.append("–" if rang is None else str(rang + 1))
        if len(set(r)) > 1:
            out.append(f"| {a['q']} | {a['typ']} | {', '.join(a['ziel'])} | " + " | ".join(r) + " |")
    out += ["", "## Betrieb", "", "```json", json.dumps(zeit, ensure_ascii=False, indent=1), "```"]
    (ERG / "ergebnis.md").write_text("\n".join(out) + "\n")
    print("\n".join(out))


if __name__ == "__main__":
    main()
