#!/usr/bin/env python3
"""Prüft data/steckbriefe.json und data/toolchain-flows.json.

Aufruf:  python3 scripts/validate.py
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

LAYERS = {"core", "ext", "btp", "ai", "int", "data", "lob", "tool", "mig", "pm", "sec", "ops"}
STATUS = {"aktiv", "neu", "umbenannt", "auslaufend", "abgekuendigt"}
BELEGT = {"ja", "teilweise", "nein"}
REQUIRED = ["id", "layer", "name", "aka", "kurz", "was", "wie", "s4", "wann", "test",
            "lizenz", "status", "statusText", "daten", "verwandt", "quellen", "belegt", "hinweis"]
DATE_RE = re.compile(r"^\d{4}(-\d{2}(-\d{2})?)?$")


def validate(data, flows):
    errors = []
    ids = [d.get("id") for d in data]
    seen = set()
    for i in ids:
        if i in seen:
            errors.append(f"doppelte ID: {i}")
        seen.add(i)
    known = set(ids)

    for d in data:
        did = d.get("id", "?")
        for k in REQUIRED:
            if k not in d:
                errors.append(f"{did}: Feld '{k}' fehlt")
        if d.get("layer") not in LAYERS:
            errors.append(f"{did}: unbekannter layer '{d.get('layer')}'")
        if d.get("status") not in STATUS:
            errors.append(f"{did}: unbekannter status '{d.get('status')}'")
        if d.get("belegt") not in BELEGT:
            errors.append(f"{did}: unbekannter belegt-Wert '{d.get('belegt')}'")
        if len(d.get("kurz", "")) > 110:
            errors.append(f"{did}: 'kurz' länger als 110 Zeichen")
        for v in d.get("verwandt", []):
            if v not in known:
                errors.append(f"{did}: verwandt-ID '{v}' existiert nicht")
        p = d.get("parent")
        if p and p not in known:
            errors.append(f"{did}: parent '{p}' existiert nicht")
        for x in d.get("daten", []):
            if not DATE_RE.match(str(x.get("datum", ""))):
                errors.append(f"{did}: ungültiges Datum '{x.get('datum')}'")
        for q in d.get("quellen", []):
            if not str(q.get("url", "")).startswith("https://"):
                errors.append(f"{did}: Quelle ohne https-URL: {q}")

    for f in flows:
        for k in ("von", "nach"):
            if f.get(k) not in known:
                errors.append(f"Toolchain-Fluss: '{f.get(k)}' ({k}) existiert nicht")
    return errors


if __name__ == "__main__":
    data = json.loads((ROOT / "data/steckbriefe.json").read_text(encoding="utf-8"))
    flows = json.loads((ROOT / "data/toolchain-flows.json").read_text(encoding="utf-8"))
    errs = validate(data, flows)
    for e in errs:
        print("-", e)
    print(f"{len(data)} Steckbriefe, {len(flows)} Flüsse, {len(errs)} Fehler")
    sys.exit(1 if errs else 0)
