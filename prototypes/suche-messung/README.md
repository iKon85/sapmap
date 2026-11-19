# Suche über die Steckbriefe messen (Wegwerfcode, Ticket #17)

Bericht: `docs/recherche/suche-mcp-zugang.md`. Hier liegen nur Skript, Anfragen und Rohergebnisse.

- `anfragen.json`: 50 Suchanfragen in sechs Typen (Name, Abkürzung/Altname, umschreibend, ganze Frage, englisch, Tippfehler), je mit den erwarteten IDs. Ich habe sie gebaut, sie sind kein Urteil von Niko.
- `client.mjs`: c0 (Suche der heutigen Seite, 1:1 aus `src/landkarte.html`) und c1 (MiniSearch 7.2.0 über das JSON).
- `messung.py`: Postgres-Varianten p1–p3, BGE-M3 (e1) und hybrid (h1, h2), Kennzahlen und `erg/ergebnis.md`.
- `vergleich.py`: Paarvergleich je Anfrage mit Vorzeichentest, `erg/vergleich.md`.

## Wiederholen

```bash
npm install && node client.mjs
docker run -d --name sapmap-suche-mess -e POSTGRES_PASSWORD=lokal -p 127.0.0.1:55433:5432 activate-pg:17-ts
docker exec sapmap-suche-mess psql -U postgres -c "create extension pg_textsearch; create extension vector; create extension pg_trgm;"
uv run --no-project --python 3.12 --with sentence-transformers --with torch \
  --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match \
  --with 'psycopg[binary]' --with numpy python messung.py
python3 vergleich.py
docker rm -f sapmap-suche-mess
```

Das Image `activate-pg:17-ts` stammt aus `prototypes/postgres-suche/Dockerfile` im Repo `iKon85/activate` (Branch `research/postgres-suche`): pgvector 0.8.2 auf Postgres 17 plus pg_textsearch 1.5.1. BGE-M3 lädt `sentence-transformers` aus dem Hugging-Face-Cache.
