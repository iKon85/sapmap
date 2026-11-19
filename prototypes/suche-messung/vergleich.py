"""Paarvergleich je Anfrage (Rang des ersten erwarteten Treffers in Top 10) mit zweiseitigem Vorzeichentest."""
import json
from math import comb
from pathlib import Path
H = Path(__file__).parent
A = json.loads((H / "anfragen.json").read_text()); E = json.loads((H / "erg/listen.json").read_text())
def rang(v, a):
    l = E[v][a["q"]][:10]; return next((i for i, x in enumerate(l) if x in a["ziel"]), 99)
def vz(b, s):
    n = b + s; k = min(b, s); return min(1.0, 2 * sum(comb(n, i) for i in range(k + 1)) / 2 ** n) if n else 1.0
paare = [("c1", "c0"), ("c1", "p2"), ("h1", "p2"), ("h1", "c1"), ("e1", "c1"), ("p2", "p1"), ("h1", "e1")]
zeilen = ["| Vergleich | besser | schlechter | gleich | p (Vorzeichentest) |", "|---|---|---|---|---|"]
for x, y in paare:
    b = sum(rang(x, a) < rang(y, a) for a in A); s = sum(rang(x, a) > rang(y, a) for a in A)
    zeilen.append(f"| {x} gegen {y} | {b} | {s} | {len(A)-b-s} | {vz(b, s):.2f} |")
out = "\n".join(zeilen); print(out); (H / "erg/vergleich.md").write_text(out + "\n")
