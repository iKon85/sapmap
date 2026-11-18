"use strict";
/* Gemeinsamer Kern der drei Alternativen: Daten, Suche, Formatierung und die Teile des Steckbriefs.
   Jede Alternative definiert selbst zeigen() und oeffnen(id, ausloeser). */

const BEREICHE = [
  ["core", "S/4HANA-Kern & Deployment", "Das ERP, seine Betriebsvarianten und eingebaute Komponenten, darunter das Projektmanagement des Unternehmens (PS, EPPM, CPM)."],
  ["ext", "Clean Core & Erweiterbarkeit", "Wie man S/4HANA erweitert, ohne den Kern zu verbiegen."],
  ["btp", "Plattform & Entwicklung", "SAP BTP: Laufzeiten, Entwicklungswerkzeuge und Basisdienste."],
  ["ai", "Business AI & Joule", "Assistent, Agenten und die KI-Dienste darunter."],
  ["int", "Integration", "Schnittstellen, Events, Replikation. Ersetzt PI/PO."],
  ["data", "Daten & Analytics", "Data Cloud, Data Warehouse und Berichtswesen."],
  ["lob", "LoB-Cloud-Apps & Branchen", "SaaS-Lösungen, die S/4HANA fachlich ergänzen, plus Utilities."],
  ["tool", "Toolchain, ALM & Test", "Prozessmodelle, Architektur, Application Lifecycle und Test."],
  ["mig", "Migration & Transformation", "Werkzeuge für den Weg von ECC nach S/4HANA."],
  ["pm", "Einführungsprojekt steuern", "Methodik und Werkzeuge, um die Einführung selbst zu planen und zu steuern."],
  ["sec", "Security, Identity & GRC", "Identitäten, Berechtigungen, Compliance."],
  ["ops", "Betrieb & Infrastruktur", "Wer betreibt was, wo läuft es, welche Werkzeuge helfen."]
];
const BER = Object.fromEntries(BEREICHE.map(([id, name, beschr], i) => [id, { id, name, beschr, i }]));

const STATUS = { aktiv: "aktiv", neu: "neu", umbenannt: "umbenannt", auslaufend: "läuft aus", abgekuendigt: "abgekündigt" };
const STATUS_FOLGE = ["aktiv", "neu", "umbenannt", "auslaufend", "abgekuendigt"];
const BELEG = { ja: "belegt", teilweise: "teilweise belegt", nein: "unbelegt" };
const BELEG_FOLGE = ["ja", "teilweise", "nein"];
const STAND = "Stand Oktober 2026"; // Die Daten enthalten kein Recherche-Datum.
const HEUTE = new Date().toISOString().slice(0, 10);

let DATA = [];
let byId = {};
let KIDS = {};     // Portfolio-ID -> Einzelprodukte
let REL = {};      // id -> { eigen: [...], rueck: [...], alle: [...] }
let SUCHTEXT = {}; // id -> normalisierter Text

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");

/* ---------- Piktogramme ---------- */

// Phosphor Icons 2.1.1 (MIT), Pfade lokal aus @phosphor-icons/core übernommen: regular, kleine Marken in bold.
document.body.insertAdjacentHTML("afterbegin", `
<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-suche" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></symbol>
  <symbol id="i-x" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></symbol>
  <symbol id="i-zurueck" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></symbol>
  <symbol id="i-weiter" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></symbol>
  <symbol id="i-auf" viewBox="0 0 256 256"><path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"/></symbol>
  <symbol id="i-rechts" viewBox="0 0 256 256"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"/></symbol>
  <symbol id="i-extern" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/></symbol>
  <symbol id="i-neu" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"/></symbol>
  <symbol id="i-umbenannt" viewBox="0 0 256 256"><path d="M228,48V152a20,20,0,0,1-20,20H112.92a12,12,0,0,1-17.41,16.49l-20-20a12,12,0,0,1,0-17l20-20A12,12,0,0,1,112.92,148H204V52H100a12,12,0,0,1-24,0V48A20,20,0,0,1,96,28H208A20,20,0,0,1,228,48ZM168,192a12,12,0,0,0-12,12H52V108h91.08a12,12,0,0,0,17.41,16.49l20-20a12,12,0,0,0,0-17l-20-20A12,12,0,0,0,143.08,84H48a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20H160a20,20,0,0,0,20-20v-4A12,12,0,0,0,168,192Z"/></symbol>
  <symbol id="i-auslaufend" viewBox="0 0 256 256"><path d="M204,75.64V40a20,20,0,0,0-20-20H72A20,20,0,0,0,52,40V76a20.1,20.1,0,0,0,8,16l48,36L60,164a20.1,20.1,0,0,0-8,16v36a20,20,0,0,0,20,20H184a20,20,0,0,0,20-20V180.36a20.13,20.13,0,0,0-7.94-16L147.9,128l48.16-36.4A20.13,20.13,0,0,0,204,75.64ZM180,44V72H76V44Zm-52,69L105.33,96h45.1Zm52,99H76V182l40-30v16a12,12,0,0,0,24,0V152.11l40,30.24Z"/></symbol>
  <symbol id="i-abgekuendigt" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm84,108a83.6,83.6,0,0,1-16.75,50.28L77.72,60.75A84,84,0,0,1,212,128ZM44,128A83.6,83.6,0,0,1,60.75,77.72L178.28,195.25A84,84,0,0,1,44,128Z"/></symbol>
  <symbol id="i-sonne" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/></symbol>
  <symbol id="i-mond" viewBox="0 0 256 256"><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"/></symbol>
  <symbol id="i-test" viewBox="0 0 256 256"><path d="M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23ZM110.86,103.25A7.93,7.93,0,0,0,112,99.14V40h32V99.14a7.93,7.93,0,0,0,1.14,4.11L183.36,167c-12,2.37-29.07,1.37-51.75-10.11-15.91-8.05-31.05-12.32-45.22-12.81ZM48,208l28.54-47.58c14.25-1.74,30.31,1.85,47.82,10.72,19,9.61,35,12.88,48,12.88a69.89,69.89,0,0,0,19.55-2.7L208,208Z"/></symbol>
  <symbol id="i-kalender" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/></symbol>
  <symbol id="i-info" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/></symbol>
</svg>`);
const ico = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/* ---------- Daten ---------- */

function aufbereiten(data) {
  DATA = data;
  byId = Object.fromEntries(DATA.map((d) => [d.id, d]));
  KIDS = {};
  DATA.forEach((d) => { if (d.parent && byId[d.parent]) (KIDS[d.parent] ||= []).push(d); });
  REL = Object.fromEntries(DATA.map((d) => [d.id, { eigen: [], rueck: [], alle: [] }]));
  DATA.forEach((d) => (d.verwandt || []).forEach((v) => {
    if (byId[v] && v !== d.id && !REL[d.id].eigen.includes(v)) REL[d.id].eigen.push(v);
  }));
  DATA.forEach((d) => REL[d.id].eigen.forEach((v) => {
    if (!REL[v].eigen.includes(d.id) && !REL[v].rueck.includes(d.id)) REL[v].rueck.push(d.id);
  }));
  DATA.forEach((d) => {
    REL[d.id].alle = [...REL[d.id].eigen, ...REL[d.id].rueck];
    SUCHTEXT[d.id] = norm([d.id, d.name, (d.aka || []).join(" "), d.kurz, d.was, d.wie, d.s4, d.wann, d.lizenz, d.statusText].join(" \n "));
    d._termine = termineVon(d);
    d._naechster = d._termine.find((t) => t.kommt) || null;
  });
}

function laden() {
  return fetch("../../../data/steckbriefe.json")
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then((data) => { aufbereiten(data); return DATA; });
}

function ladeFehler(ziel, err) {
  ziel.innerHTML = `<div class="meldung"><p><strong>Die Steckbriefe konnten nicht geladen werden.</strong></p>
    <p>Die Seite braucht einen lokalen Webserver, gestartet im Projektordner (<code>python3 -m http.server</code>). Fehler: ${esc(err.message)}</p></div>`;
  ziel.removeAttribute("aria-busy");
}

/* ---------- Datum ---------- */

const datumTeile = (s) => String(s || "").match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
function fmtDatum(s) {
  const m = datumTeile(s);
  if (!m) return esc(s);
  if (m[3]) return `${m[3]}.${m[2]}.${m[1]}`;
  if (m[2]) return `${m[2]}/${m[1]}`;
  return m[1];
}
// Zeitraum einer Angabe: frühester Tag, spätester Tag und Lage auf einer Zeitachse (Jahresbruch, Mitte des Zeitraums).
// Laut Datenmodell stehen Quartale als Jahr im Feld und als „Q3 2026: …“ am Anfang des Textes.
function zeitraum(datum, text) {
  const m = datumTeile(datum);
  if (!m) return null;
  const z2 = (n) => String(n).padStart(2, "0");
  if (m[3]) return { von: `${m[1]}-${m[2]}-${m[3]}`, bis: `${m[1]}-${m[2]}-${m[3]}`, lage: +m[1] + (+m[2] - 1) / 12 + (+m[3] - 1) / 365 };
  if (m[2]) return { von: `${m[1]}-${m[2]}-01`, bis: `${m[1]}-${m[2]}-31`, lage: +m[1] + (+m[2] - 0.5) / 12 };
  const q = String(text || "").match(/^Q([1-4])\b/);
  if (q) { const a = (+q[1] - 1) * 3 + 1; return { von: `${m[1]}-${z2(a)}-01`, bis: `${m[1]}-${z2(a + 2)}-31`, lage: +m[1] + (a + 0.5) / 12 }; }
  return { von: `${m[1]}-01-01`, bis: `${m[1]}-12-31`, lage: +m[1] + 0.5 };
}
// Wartungsenden werden wie auf der bisherigen Seite am Text erkannt; das Muster verlangt hier ein Ende, nicht nur das Wort „Wartung“.
const istWartungsende = (t) => /wartungsende|ende\b[^.;:]{0,40}(wartung|maintenance|nutzungsrecht|support|unterstützung)|support-?ende|lebensende|end of life|end-of-|erlischt|abgek(ü|ue)ndigt|eingestellt|stillleg|deprecat|\bendet\b|läuft aus|auslaufen|retire/i.test(t || "");

function termineVon(d) {
  return (d.daten || [])
    .filter((x) => datumTeile(x.datum) && x.text)
    .map((x) => { const z = zeitraum(x.datum, x.text); return { datum: x.datum, text: x.text, key: z.von, kommt: z.bis >= HEUTE, ende: istWartungsende(x.text), lage: z.lage }; })
    .sort((a, b) => a.key.localeCompare(b.key));
}

/* ---------- Suche ---------- */

function treffer(q, test) {
  const teile = norm(q).split(/\s+/).filter(Boolean);
  if (!teile.length) return null;
  const set = new Set();
  DATA.forEach((d) => {
    const t = test ? SUCHTEXT[d.id] + " " + norm(d.test) : SUCHTEXT[d.id];
    if (teile.every((w) => t.includes(w))) set.add(d.id);
  });
  return set;
}

// Text mit <mark> um die Fundstellen; arbeitet auf dem normalisierten Text und rechnet auf das Original zurück.
function mark(text, q) {
  const t = String(text ?? "");
  const teile = norm(q).split(/\s+/).filter((w) => w.length > 1);
  if (!teile.length) return esc(t);
  let out = ""; const map = [];
  for (let i = 0; i < t.length; i++) { const n = norm(t[i]); for (let k = 0; k < n.length; k++) { out += n[k]; map.push(i); } }
  const an = new Array(t.length).fill(false);
  teile.forEach((w) => {
    let i = out.indexOf(w);
    while (i >= 0) { for (let k = map[i]; k <= map[i + w.length - 1]; k++) an[k] = true; i = out.indexOf(w, i + 1); }
  });
  let html = "", offen = false;
  for (let i = 0; i < t.length; i++) {
    if (an[i] && !offen) { html += "<mark>"; offen = true; }
    if (!an[i] && offen) { html += "</mark>"; offen = false; }
    html += esc(t[i]);
  }
  return html + (offen ? "</mark>" : "");
}

// Fundstelle: Wo steht ein Suchbegriff, der weder im Namen noch in der Kurzbeschreibung vorkommt?
const FUND_FELDER = [["aka", "Auch bekannt als"], ["was", "Was es leistet"], ["wie", "Wie es funktioniert"], ["s4", "Bezug zu S/4HANA"], ["wann", "Wann man es einsetzt"], ["lizenz", "Lizenz"], ["statusText", "Status"], ["test", "Testperspektive"]];
function fundstelle(d, q, test) {
  const teile = norm(q).split(/\s+/).filter((w) => w.length > 1);
  const kopf = norm(d.name + " " + d.kurz);
  const fehlt = teile.find((w) => !kopf.includes(w));
  if (!fehlt) return "";
  for (const [f, label] of FUND_FELDER) {
    if (f === "test" && !test) continue;
    const roh = Array.isArray(d[f]) ? d[f].join(", ") : String(d[f] || "");
    const i = norm(roh).indexOf(fehlt);
    if (i < 0 || norm(roh).length !== roh.length) continue; // Rückrechnung nur, wenn die Normalisierung die Länge hält
    let a = Math.max(0, i - 40), e = Math.min(roh.length, i + fehlt.length + 50);
    if (a > 0) { const sp = roh.indexOf(" ", a); if (sp > -1 && sp < i) a = sp + 1; }
    if (e < roh.length) { const sp = roh.lastIndexOf(" ", e); if (sp > i + fehlt.length) e = sp; }
    return `<p class="fund"><span class="fund-f">${label}:</span> ${a > 0 ? "…" : ""}${mark(roh.slice(a, e), fehlt)}${e < roh.length ? "…" : ""}</p>`;
  }
  return "";
}

/* ---------- Status und Beleg ---------- */

// Ausgeschriebene Marke: Farbe, Piktogramm und Wort.
function badge(status) {
  if (!status || status === "aktiv" || !STATUS[status]) return "";
  return `<span class="badge st-${status}">${ico(status)}${STATUS[status]}</span>`;
}
const statusMarke = (d) => d.status === "aktiv" ? `<span class="aktiv">aktiv</span>` : badge(d.status);
// Kompakte Marke für dichte Darstellungen: Farbe und Piktogramm, das Wort steht im Namen des Elements.
function marke(status) {
  if (!status || status === "aktiv" || !STATUS[status]) return "";
  return `<span class="marke st-${status}" title="${STATUS[status]}">${ico(status)}</span>`;
}
const belegHtml = (b, kurz = false) => `<span class="beleg"><span class="probe b-${esc(b)}" aria-hidden="true"></span>${esc(kurz && b === "teilweise" ? "teilweise" : (BELEG[b] || b))}</span>`;
const etikett = (d) => `${d.name}${d.status !== "aktiv" ? ", " + (STATUS[d.status] || d.status) : ""}`;

/* ---------- Adresse ---------- */

const lesen = () => Object.fromEntries(new URLSearchParams(location.search));
function adresse(z) {
  const p = new URLSearchParams();
  Object.keys(z).forEach((k) => { const v = z[k]; if (v !== null && v !== undefined && v !== "" && v !== false) p.set(k, v === true ? "1" : v); });
  const s = p.toString();
  return location.pathname + (s ? "?" + s : "");
}
function gehe(aenderung, { ersetzen = false } = {}) {
  const neu = adresse(Object.assign(lesen(), aenderung));
  if (ersetzen) history.replaceState(history.state || { app: true }, "", neu);
  else history.pushState({ app: true }, "", neu);
  zeigen();
}
const bausteinHref = (id) => adresse({ test: lesen().test, baustein: id });
function merkeScroll() { history.replaceState(Object.assign({}, history.state || { app: true }, { y: window.scrollY }), "", location.href); }

/* ---------- Teile des Steckbriefs ---------- */

const feld = (titel, text, cls = "") => text ? `<section class="feld ${cls}"><h3>${titel}</h3><p>${esc(text)}</p></section>` : "";
function sbFelder(d, test) {
  return {
    was: feld("Was es leistet", d.was),
    wie: feld("Wie es funktioniert", d.wie),
    s4: feld("Bezug zu S/4HANA", d.s4),
    wann: feld("Wann man es einsetzt", d.wann),
    test: test ? feld("Testperspektive", d.test, "test") : "",
    lizenz: feld("Lizenz und Paketierung", d.lizenz)
  };
}
const sbAka = (d) => d.aka && d.aka.length ? `<p class="sb-aka"><span class="lbl">Auch bekannt als</span> ${d.aka.map(esc).join(" · ")}</p>` : "";

function terminHtml(t) {
  return `<li class="${t.kommt ? "kommt" : "vorbei"}${t.ende ? " ende" : ""}"><time datetime="${esc(t.datum)}">${fmtDatum(t.datum)}</time><span>${t.ende ? `<span class="ende-m">${ico("auslaufend")}<span class="visually-hidden">Wartungsende: </span></span>` : ""}${esc(t.text)}</span></li>`;
}
// Daten als Liste, die Marke „heute“ trennt Vergangenes von Kommendem.
function sbDaten(d) {
  const ts = d._termine;
  if (!ts.length) return "";
  let html = "", gesetzt = false;
  ts.forEach((t) => {
    if (!gesetzt && t.kommt) { html += `<li class="heute"><span>heute</span></li>`; gesetzt = true; }
    html += terminHtml(t);
  });
  if (!gesetzt) html += `<li class="heute"><span>heute</span></li>`;
  return `<section class="feld"><h3>Daten</h3><ol class="daten">${html}</ol></section>`;
}
function sbBeleg(d) {
  return `<section class="feld hinweis"><h3>Belegstatus</h3><p class="beleg-zeile">${belegHtml(d.belegt)}</p>${d.hinweis ? `<p>${esc(d.hinweis)}</p>` : ""}</section>`;
}
function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
function sbQuellen(d) {
  const q = d.quellen || [];
  return `<section class="feld"><h3>Quellen</h3>${q.length
    ? `<ol class="quellen">${q.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.titel)}${ico("extern")}<span class="visually-hidden"> (öffnet in neuem Tab)</span></a><span class="host">${esc(host(x.url))}</span></li>`).join("")}</ol>`
    : `<p class="leer-hinweis">Keine Quelle hinterlegt.</p>`}</section>`;
}
// Verweis auf einen Baustein, überall gleich: Name, kompakte Statusmarke, optional der Bereich.
function bsLink(d, { bereich = false, klasse = "" } = {}) {
  if (!d) return "";
  return `<a class="bl ${klasse}" href="${bausteinHref(d.id)}" data-id="${esc(d.id)}" aria-label="${esc(etikett(d))}"><span class="bl-n">${esc(d.name)}</span>${marke(d.status)}${bereich ? `<span class="bl-b">${esc(BER[d.layer]?.name || d.layer)}</span>` : ""}</a>`;
}

/* ---------- Kopf: Suche und Testperspektive ---------- */

function kopfVerdrahten(zusatz = () => ({})) {
  const q = $("#q"), tp = $("#testperspektive");
  q.addEventListener("input", () => gehe(Object.assign({ q: q.value.trim() ? q.value : null }, zusatz()), { ersetzen: !!lesen().q || !q.value.trim() }));
  q.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && q.value) { e.preventDefault(); e.stopPropagation(); q.value = ""; gehe({ q: null }, { ersetzen: true }); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.target.closest?.("input, textarea, select, [contenteditable]")) { e.preventDefault(); q.focus(); q.select(); }
  });
  tp.addEventListener("click", () => gehe({ test: lesen().test ? null : "1" }, { ersetzen: true }));
}
function kopfZeigen(z) {
  const q = $("#q");
  $("#testperspektive").setAttribute("aria-checked", String(z.test === "1"));
  if (document.activeElement !== q && q.value !== (z.q || "")) q.value = z.q || "";
}

/* ---------- Hell und dunkel ---------- */

// Die Klasse .dark setzt ein Einzeiler im <head> vor dem ersten Zeichnen; hier nur der Schalter (#thema).
function themaVerdrahten() {
  const b = $("#thema");
  if (!b) return;
  const zeige = () => {
    const dunkel = document.documentElement.classList.contains("dark");
    b.setAttribute("aria-pressed", String(dunkel));
    b.innerHTML = ico(dunkel ? "sonne" : "mond") + `<span class="visually-hidden">Dunkles Design</span>`;
    b.title = dunkel ? "Zum hellen Design wechseln" : "Zum dunklen Design wechseln";
  };
  b.addEventListener("click", () => {
    const dunkel = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("lk-thema", dunkel ? "dark" : "light"); } catch (e) { /* ohne Speicher gilt die Wahl bis zum Neuladen */ }
    zeige();
  });
  zeige();
}
themaVerdrahten();

// Klick auf einen Baustein, egal wo: die Alternative entscheidet in oeffnen(), was passiert.
document.addEventListener("click", (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const el = e.target.closest?.("[data-id]");
  if (!el || !(el.matches("a, button"))) return;
  e.preventDefault();
  oeffnen(el.dataset.id, el);
});
window.addEventListener("popstate", () => zeigen());
history.scrollRestoration = "manual";
