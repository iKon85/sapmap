#!/usr/bin/env python3
"""Baut die S/4HANA-Landkarte aus Vorlage und Daten.

Aufruf:  python3 scripts/build.py

Liest:   src/landkarte.html, data/steckbriefe.json, data/toolchain-flows.json
Schreibt:
  dist/index.html     eigenständige Seite zum Hosten (mit <!doctype>, <head>, Basis-Reset)
  dist/artifact.html  Fragment ohne Dokumentgerüst, für die Veröffentlichung als Claude-Artifact

Vor dem Schreiben prüft scripts/validate.py die Daten; bei Fehlern bricht der Build ab.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from validate import validate  # noqa: E402

SHELL_HEAD = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Interaktive Architekturkarte der SAP-Landschaft rund um S/4HANA: Steckbriefe, Schichtenmodell, Integrationswege, Toolchain, Clean Core und Wartungsenden.">
<style>
  :root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
  body{margin:0;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
"""


def js(obj):
    # "</" escapen, damit Daten das <script>-Tag nicht vorzeitig schließen
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def main():
    data = json.loads((ROOT / "data/steckbriefe.json").read_text(encoding="utf-8"))
    flows = json.loads((ROOT / "data/toolchain-flows.json").read_text(encoding="utf-8"))

    errors = validate(data, flows)
    if errors:
        print("Build abgebrochen, Datenfehler:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        sys.exit(1)

    tpl = (ROOT / "src/landkarte.html").read_text(encoding="utf-8")
    for marker in ("/*__DATA__*/[]", "/*__FLOWS__*/[]"):
        if marker not in tpl:
            sys.exit(f"Platzhalter {marker} fehlt in src/landkarte.html")
    page = tpl.replace("/*__DATA__*/[]", js(data)).replace("/*__FLOWS__*/[]", js(flows))

    out = ROOT / "dist"
    out.mkdir(exist_ok=True)
    (out / "artifact.html").write_text(page, encoding="utf-8")

    # Für die eigenständige Seite: <title>, Metas, <link> und <style> der Vorlage in den <head> ziehen
    body_start = page.index('<div class="wrap">')
    head_part, body_part = page[:body_start], page[body_start:]
    (out / "index.html").write_text(
        SHELL_HEAD + head_part + "</head>\n<body>\n" + body_part + "\n</body>\n</html>\n",
        encoding="utf-8",
    )
    print(f"OK: {len(data)} Steckbriefe, {len(flows)} Toolchain-Flüsse -> dist/index.html, dist/artifact.html")


if __name__ == "__main__":
    main()
