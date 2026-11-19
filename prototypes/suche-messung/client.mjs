// Clientseitige Varianten (Wegwerfcode): c0 = Suche der heutigen Seite, c1 = MiniSearch über das JSON.
import fs from "node:fs";
import MiniSearch from "minisearch";

const DATA = JSON.parse(fs.readFileSync(new URL("../../data/steckbriefe.json", import.meta.url)));
const ANFR = JSON.parse(fs.readFileSync(new URL("./anfragen.json", import.meta.url)));

// c0: 1:1 die Logik aus src/landkarte.html (applyFilter): alle Wörter als Teilstring in name, aka, kurz, was, id.
// Kein Ranking: Treffer erscheinen in Dateireihenfolge.
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\/\-]/g, " ");
const HAY = Object.fromEntries(DATA.map(d => [d.id, norm([d.name, (d.aka || []).join(" "), d.kurz, d.was, d.id].join(" "))]));
function c0(q) {
  const terms = norm(q).trim().split(/\s+/).filter(Boolean);
  return DATA.filter(d => terms.every(t => HAY[d.id].includes(t))).map(d => d.id);
}

// c1: MiniSearch, alle Textfelder, Name und aka stark gewichtet, Präfix und Tippfehlertoleranz, ODER-Verknüpfung.
const STOPP = new Set("der die das den dem des ein eine einen einem einer und oder mit von vom zu zum zur im in ins auf aus für nach wie was wann welches welche welcher womit ich mein meine die bekomme ist sind wird werden nicht nur auch bei".split(" "));
const fold = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const ms = new MiniSearch({
  idField: "id",
  fields: ["name", "aka", "kurz", "was", "wie", "s4", "wann", "lizenz", "test", "statusText", "idtext"],
  extractField: (d, f) => f === "aka" ? (d.aka || []).join(" ; ") : f === "idtext" ? d.id.replace(/-/g, " ") : d[f],
  processTerm: t => { const x = fold(t); return x.length < 2 || STOPP.has(x) ? null : x; },
  tokenize: s => s.split(/[\s\-\/,;:.()!?„“"']+/u),
  searchOptions: {
    boost: { name: 4, aka: 3, idtext: 2, kurz: 2, was: 1, wie: 0.7, s4: 0.7, wann: 0.7, lizenz: 0.5, test: 0.3, statusText: 0.5 },
    prefix: t => t.length >= 4, fuzzy: t => (t.length >= 5 ? 0.2 : false), combineWith: "OR",
  },
});
ms.addAll(DATA);
const c1 = q => ms.search(q).map(r => r.id);

fs.mkdirSync(new URL("./erg/", import.meta.url), { recursive: true });
const out = { c0: {}, c1: {} };
const t = { c0: 0, c1: 0 };
for (const a of ANFR) {
  for (const [k, f] of [["c0", c0], ["c1", c1]]) {
    const s = performance.now(); out[k][a.q] = f(a.q).slice(0, 20); t[k] += performance.now() - s;
  }
}
out._zeit_ms_je_anfrage = { c0: +(t.c0 / ANFR.length).toFixed(3), c1: +(t.c1 / ANFR.length).toFixed(3) };
out._json_bytes = fs.statSync(new URL("../../data/steckbriefe.json", import.meta.url)).size;
fs.writeFileSync(new URL("./erg/client.json", import.meta.url), JSON.stringify(out, null, 1));
console.log("client ok", out._zeit_ms_je_anfrage, out._json_bytes);
