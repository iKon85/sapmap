"use strict";

/* ---------- feste Oberflächendaten ---------- */

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
const BER = Object.fromEntries(BEREICHE.map(([id, name, beschr]) => [id, { id, name, beschr }]));

// Mehrfachzuordnung: Bausteine, die zusätzlich in einem anderen Bereich erscheinen
const AUCH = {
  "data-services": ["mig"], "slt": ["mig"], "atc": ["mig"], "business-partner": ["mig"],
  "migration-assessment": ["mig"], "embedded-analytics": ["data"], "hana-cloud": ["data"]
};

const STATUS = {
  aktiv: "aktiv", neu: "neu", umbenannt: "umbenannt",
  auslaufend: "läuft aus", abgekuendigt: "abgekündigt"
};
const BELEG = { ja: "belegt", teilweise: "teilweise belegt", nein: "unbelegt" };

const ANSICHTEN = {
  karte: "Landkarte", schichten: "Schichtenmodell", integration: "Integrationswege",
  toolchain: "Toolchain", zeitleiste: "Zeitleiste"
};

const STAND = "Stand Oktober 2026"; // Die Daten enthalten kein Recherche-Datum.

const EINSTIEG = (L) => `
  <p>Acht Verschiebungen, die man vor dem ersten Workshop kennen sollte. Jeder Name öffnet den Steckbrief.</p>
  <ol>
    <li>Die Produktnamen: Die Public Edition heißt ${L("s4-cloud-erp")}, die Private Edition ${L("s4-private")}; alles hängt unter der ${L("business-suite")}.</li>
    <li>${L("clean-core")} wird seit August 2025 in Stufen A bis D gemessen, nicht mehr im Drei-Tier-Modell.</li>
    <li>PI/PO endet: ${L("pipo")} geht in die ${L("integration-suite")}, hybrid über die ${L("eic")}.</li>
    <li>Daten wandern in die ${L("bdc")}; ${L("datasphere")} und ${L("sac")} sind dort Bausteine.</li>
    <li>Die Werkzeuge der Einführung bilden eine Kette: ${L("agent-led-toolchain")} mit ${L("signavio")}, ${L("leanix")} und ${L("cloud-alm")}.</li>
    <li>${L("solman")} läuft Ende 2027 aus; Test und ALM ziehen nach ${L("cloud-alm")} und zu ${L("tricentis-ect")}.</li>
    <li>KI ist Teil der Plattform: ${L("joule")}, ${L("autonomous-suite")} und ${L("joule-studio")}.</li>
    <li>2027 laufen viele Wartungen aus, darunter ${L("idm")}, ${L("grc")} und ${L("lama")}.</li>
  </ol>`;

/* ---------- Zustand ---------- */

let DATA = [];
let byId = {};
let REL = {};       // id -> { eigen: [...], rueck: [...] }
let KIDS = {};      // parent -> [kinder]
let SUCHTEXT = {};  // id -> normalisierter Text
let zuletzt = null; // zuletzt geöffneter Baustein (Markierung auf der Karte)
let sucheAktivSeit = null; // URL, an der die laufende Suche begann

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Normalisiert und merkt für jedes Zeichen des Ergebnisses die Stelle im Original.
function normMap(s) {
  s = String(s ?? "");
  let out = ""; const map = [];
  for (let i = 0; i < s.length; i++) {
    const n = norm(s[i]);
    for (let k = 0; k < n.length; k++) { out += n[k]; map.push(i); }
  }
  map.push(s.length);
  return { out, map };
}
const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");

function lesen() {
  const p = new URLSearchParams(location.search);
  const ansicht = ANSICHTEN[p.get("ansicht")] ? p.get("ansicht") : "karte";
  return {
    ansicht,
    baustein: p.get("baustein") || null,
    q: p.get("q") || "",
    test: p.get("test") === "1"
  };
}

function url(z) {
  const p = new URLSearchParams();
  if (z.ansicht && z.ansicht !== "karte") p.set("ansicht", z.ansicht);
  if (z.baustein) p.set("baustein", z.baustein);
  if (z.q) p.set("q", z.q);
  if (z.test) p.set("test", "1");
  const s = p.toString();
  return location.pathname + (s ? "?" + s : "");
}

function gehe(aenderung, { ersetzen = false, extra = {} } = {}) {
  const z = Object.assign(lesen(), aenderung);
  const neu = url(z);
  const state = Object.assign({ app: true }, extra);
  if (ersetzen) history.replaceState(state, "", neu);
  else history.pushState(state, "", neu);
  zeigen();
}

function merkeScroll(anker) {
  const extra = { app: true, scroll: window.scrollY };
  if (anker && anker.dataset && anker.dataset.id && anker.closest("#karte")) {
    extra.anker = anker.dataset.id;
    extra.ankerTop = anker.getBoundingClientRect().top;
  }
  const st = Object.assign({}, history.state || {}, extra);
  history.replaceState(st, "", location.href);
}

/* ---------- Daten aufbereiten ---------- */

function aufbereiten(data) {
  DATA = data;
  byId = Object.fromEntries(DATA.map((d) => [d.id, d]));
  KIDS = {};
  DATA.forEach((d) => { if (d.parent && byId[d.parent]) (KIDS[d.parent] ||= []).push(d); });
  REL = Object.fromEntries(DATA.map((d) => [d.id, { eigen: [], rueck: [] }]));
  DATA.forEach((d) => {
    (d.verwandt || []).forEach((v) => {
      if (!byId[v] || v === d.id) return;
      if (!REL[d.id].eigen.includes(v)) REL[d.id].eigen.push(v);
    });
  });
  DATA.forEach((d) => {
    REL[d.id].eigen.forEach((v) => {
      if (!REL[v].eigen.includes(d.id) && !REL[v].rueck.includes(d.id)) REL[v].rueck.push(d.id);
    });
  });
  DATA.forEach((d) => {
    SUCHTEXT[d.id] = norm([d.id, d.name, (d.aka || []).join(" "), d.kurz, d.was, d.wie, d.s4, d.wann, d.lizenz, d.statusText].join(" \n "));
  });
}

function verwandteIds(id) {
  const r = REL[id];
  return r ? new Set([...r.eigen, ...r.rueck]) : new Set();
}

/* ---------- Bausteine rendern ---------- */

function badge(status) {
  if (!status || status === "aktiv" || !STATUS[status]) return "";
  return `<span class="badge st-${status}"><svg aria-hidden="true"><use href="#i-${status}"/></svg>${STATUS[status]}</span>`;
}

function bsKnopf(d, { heimat = false, klasse = "" } = {}) {
  const st = STATUS[d.status] || d.status;
  const label = `${d.name}${d.status && d.status !== "aktiv" ? ", " + st : ""}, ${BELEG[d.belegt] || ""}`;
  const home = heimat ? `<span class="heimat">aus ${esc(BER[d.layer]?.name || d.layer)}</span>` : "";
  return `<button type="button" class="bs b-${esc(d.belegt)} ${klasse}" data-id="${esc(d.id)}" aria-label="${esc(label)}">
    <span class="nm"><span class="nm-t">${esc(d.name)}</span>${home}</span>${badge(d.status)}</button>`;
}

function karteBauen() {
  const karte = $("#karte");
  const sections = BEREICHE.map(([lid]) => {
    const eigene = DATA.filter((d) => d.layer === lid && !(d.parent && byId[d.parent]));
    const auch = DATA.filter((d) => (AUCH[d.id] || []).includes(lid));
    const anzahl = DATA.filter((d) => d.layer === lid).length;
    const items = eigene.map((d) => {
      const kids = KIDS[d.id] || [];
      const kidHtml = kids.length
        ? `<ul class="kinder" aria-label="Einzelprodukte von ${esc(d.name)}">${kids.map((k) => `<li data-id="${esc(k.id)}">${bsKnopf(k)}</li>`).join("")}</ul>`
        : "";
      return `<li data-id="${esc(d.id)}" ${kids.length ? 'data-portfolio="1"' : ""}>${bsKnopf(d, { klasse: kids.length ? "portfolio" : "" })}${kidHtml}</li>`;
    }).join("");
    const auchHtml = auch.length
      ? `<div class="auch" data-auch><h4>Auch hier relevant</h4><ul class="liste">${auch.map((d) => `<li data-id="${esc(d.id)}" data-auch-item>${bsKnopf(d, { heimat: true })}</li>`).join("")}</ul></div>`
      : "";
    const zusatz = auch.length ? ` + ${auch.length}` : "";
    const zahlTitel = auch.length ? `${anzahl} Bausteine, dazu ${auch.length} aus anderen Bereichen` : `${anzahl} Bausteine`;
    return `<section class="bereich" id="b-${lid}" data-bereich="${lid}" aria-labelledby="bh-${lid}">
      <header>
        <h3 id="bh-${lid}"><span>${esc(BER[lid].name)}</span><span class="zahl" data-zahl title="${zahlTitel}"><span class="visually-hidden">${zahlTitel}</span><span aria-hidden="true">${anzahl}${zusatz}</span></span></h3>
        <p class="beschr">${esc(BER[lid].beschr)}</p>
      </header>
      <ul class="liste">${items}</ul>
      ${auchHtml}
    </section>`;
  });
  karte.innerHTML = sections.join("");
  karte.removeAttribute("aria-busy");
  // Gesamtzahlen merken
  $$(".bereich", karte).forEach((s) => { s.dataset.gesamt = DATA.filter((d) => d.layer === s.dataset.bereich).length; });
  mauerwerk();
}

function registerBauen() {
  const eintrag = ([lid, name]) => `<li><a href="#b-${lid}" data-sprung="${lid}"><span class="nm">${esc(name)}</span><span class="zahl" data-rz="${lid}"></span></a></li>`;
  $("#register").innerHTML = `<ol>${BEREICHE.map(eintrag).join("")}</ol>`;
  $("#sprung").innerHTML = BEREICHE.map(([lid, name]) => `<a href="#b-${lid}" data-sprung="${lid}">${esc(name)} <span class="zahl" data-rz="${lid}"></span></a>`).join("");
}

/* Mauerwerk: Bereiche in die jeweils kürzeste Spalte legen */
let spaltenZahl = 0;
function mauerwerk(erzwingen = false) {
  const karte = $("#karte");
  if (!karte || !DATA.length || $("#view-karte").hidden || !$("#b-core")) return;
  const breite = karte.clientWidth;
  const n = Math.max(1, Math.min(5, Math.floor((breite + 24) / (244 + 24))));
  const sections = BEREICHE.map(([lid]) => $("#b-" + lid));
  if (n === spaltenZahl && !erzwingen) return;
  spaltenZahl = n;
  const spalten = Array.from({ length: n }, () => { const s = document.createElement("div"); s.className = "spalte"; return s; });
  karte.replaceChildren(...spalten);
  const hoehe = new Array(n).fill(0);
  sections.forEach((sec) => {
    if (sec.hidden) { spalten[0].appendChild(sec); return; }
    const i = hoehe.indexOf(Math.min(...hoehe));
    spalten[i].appendChild(sec);
    hoehe[i] += sec.offsetHeight + 28;
  });
}

/* ---------- Suche ---------- */

function treffer(q) {
  const teile = norm(q).split(/\s+/).filter(Boolean);
  if (!teile.length) return null;
  const testAn = lesen().test;
  const set = new Set();
  DATA.forEach((d) => {
    const t = testAn ? SUCHTEXT[d.id] + " " + norm(d.test) : SUCHTEXT[d.id];
    if (teile.every((w) => t.includes(w))) set.add(d.id);
  });
  return set;
}

function markiereText(el, q) {
  const t = el.dataset.orig ?? (el.dataset.orig = el.textContent);
  const teile = norm(q).split(/\s+/).filter((w) => w.length > 1);
  if (!teile.length) { el.textContent = t; return; }
  const { out, map } = normMap(t);
  const marks = new Array(t.length).fill(false);
  teile.forEach((w) => {
    let i = out.indexOf(w);
    while (i >= 0) { for (let k = map[i]; k < map[i + w.length - 1] + 1; k++) marks[k] = true; i = out.indexOf(w, i + 1); }
  });
  let html = "", offen = false;
  for (let i = 0; i < t.length; i++) {
    if (marks[i] && !offen) { html += "<mark>"; offen = true; }
    if (!marks[i] && offen) { html += "</mark>"; offen = false; }
    html += esc(t[i]);
  }
  if (offen) html += "</mark>";
  el.innerHTML = html;
}

/* Fundstelle: Zeigt bei der Suche, wo ein Begriff steht, wenn er nicht im Namen vorkommt. */
const FELDER = [["kurz", "Kurz"], ["aka", "Auch"], ["was", "Was"], ["wie", "Wie"], ["s4", "S/4HANA"], ["wann", "Wann"], ["lizenz", "Lizenz"], ["statusText", "Status"], ["test", "Test"]];
function fundstelle(knopf, q) {
  let sn = $(".snip", knopf);
  const teile = norm(q).split(/\s+/).filter(Boolean);
  const d = byId[knopf.dataset.id];
  const nameN = norm(d && d.name);
  const fehlt = teile.find((w) => !nameN.includes(w));
  if (!q || !d || !fehlt) { if (sn) sn.remove(); return; }
  const testAn = lesen().test;
  for (const [f, label] of FELDER) {
    if (f === "test" && !testAn) continue;
    const roh = Array.isArray(d[f]) ? d[f].join(", ") : String(d[f] || "");
    const { out, map } = normMap(roh);
    const j = out.indexOf(fehlt);
    if (j < 0) continue;
    const i = map[j], ende = map[j + fehlt.length - 1] + 1;
    let a = Math.max(0, i - 36), e = Math.min(roh.length, ende + 44);
    // an Wortgrenzen schneiden
    if (a > 0) { const sp = roh.indexOf(" ", a); if (sp > -1 && sp < i) a = sp + 1; }
    if (e < roh.length) { const sp = roh.lastIndexOf(" ", e); if (sp > ende) e = sp; }
    const vor = (a > 0 ? "…" : "") + roh.slice(a, i);
    const hit = roh.slice(i, ende);
    const nach = roh.slice(ende, e) + (e < roh.length ? "…" : "");
    if (!sn) { sn = document.createElement("span"); sn.className = "snip"; knopf.appendChild(sn); }
    sn.innerHTML = `<span class="snip-f">${label}:</span> ${esc(vor)}<mark>${esc(hit)}</mark>${esc(nach)}`;
    return;
  }
  if (sn) sn.remove();
}

function filtern() {
  const { q } = lesen();
  const set = treffer(q);
  let gesamt = 0;
  const proBereich = {};
  $$(".bereich").forEach((sec) => {
    const lid = sec.dataset.bereich;
    let n = 0;
    $$(":scope > .liste > li", sec).forEach((li) => {
      const id = li.dataset.id;
      const kids = $$(".kinder > li", li);
      let kidHit = false;
      kids.forEach((k) => { const hit = !set || set.has(k.dataset.id); k.hidden = !hit; if (hit && set) { kidHit = true; n++; } });
      const selbst = !set || set.has(id);
      if (set && selbst) n++;
      li.hidden = !(selbst || kidHit);
      $(":scope > .bs", li).classList.toggle("kontext", !!set && !selbst && kidHit);
    });
    const auch = $("[data-auch]", sec);
    if (auch) {
      let a = 0;
      $$("[data-auch-item]", auch).forEach((li) => { const hit = !set || set.has(li.dataset.id); li.hidden = !hit; if (hit) a++; });
      auch.hidden = a === 0;
    }
    if (!set) n = +sec.dataset.gesamt;
    proBereich[lid] = n;
    gesamt += set ? n : 0;
    const sichtbar = !set || n > 0 || (auch && !auch.hidden);
    sec.hidden = !sichtbar;
    const z = $("[data-zahl] [aria-hidden]", sec);
    const zh = $("[data-zahl] .visually-hidden", sec);
    if (set) { z.textContent = `${n} von ${sec.dataset.gesamt}`; zh.textContent = `${n} von ${sec.dataset.gesamt} Bausteinen passen`; }
    else {
      const extra = auch ? $$("[data-auch-item]", auch).length : 0;
      z.textContent = sec.dataset.gesamt + (extra ? ` + ${extra}` : "");
      zh.textContent = extra ? `${sec.dataset.gesamt} Bausteine, dazu ${extra} aus anderen Bereichen` : `${sec.dataset.gesamt} Bausteine`;
    }
  });
  $$("#karte .bs .nm-t").forEach((el) => markiereText(el, set ? q : ""));
  $$("#karte .bs").forEach((b) => fundstelle(b, set && set.has(b.dataset.id) ? q : ""));
  $$("[data-rz]").forEach((el) => {
    const lid = el.dataset.rz;
    el.textContent = set ? proBereich[lid] : (+$("#b-" + lid).dataset.gesamt);
    el.closest("a").classList.toggle("ohne", !!set && proBereich[lid] === 0);
  });
  const tr = $("#treffer");
  const bereicheMit = Object.values(proBereich).filter((n) => n > 0).length;
  if (set) {
    tr.innerHTML = gesamt
      ? `<strong>${gesamt}</strong> ${gesamt === 1 ? "Treffer" : "Treffer"} in ${bereicheMit} ${bereicheMit === 1 ? "Bereich" : "Bereichen"}`
      : `<strong>0</strong> Treffer`;
  } else {
    tr.innerHTML = `<strong>${DATA.length}</strong> Bausteine`;
  }
  $("#leer").hidden = !(set && gesamt === 0);
  if (set && gesamt === 0) $("#leer-q").textContent = `„${q}“`;
  $("#karte").hidden = !!(set && gesamt === 0);
  mauerwerk(true);
}

/* ---------- Markierung zuletzt geöffnet ---------- */

function markieren() {
  const rel = zuletzt ? verwandteIds(zuletzt) : new Set();
  $$("#karte .bs").forEach((b) => {
    b.classList.toggle("sel", b.dataset.id === zuletzt);
    b.classList.toggle("rel", rel.has(b.dataset.id));
  });
  const spur = $("#spur");
  if (zuletzt && byId[zuletzt]) {
    spur.hidden = false;
    spur.innerHTML = `<span><span class="muster sel" aria-hidden="true"></span>Zuletzt geöffnet: <strong>${esc(byId[zuletzt].name)}</strong></span>
      <span><span class="muster rel" aria-hidden="true"></span>${rel.size} verwandte Bausteine</span>
      <button type="button" class="linkbtn" id="spur-weg">Markierung entfernen</button>`;
  } else {
    spur.hidden = true; spur.innerHTML = "";
  }
}

/* ---------- Steckbrief ---------- */

function fmtDatum(s) {
  const m = String(s || "").match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return esc(s);
  if (m[3]) return `${m[3]}.${m[2]}.${m[1]}`;
  if (m[2]) return `${m[2]}/${m[1]}`;
  return m[1];
}
function datumKey(s) {
  const m = String(s || "").match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return "9999";
  return `${m[1]}-${m[2] || "01"}-${m[3] || "01"}`;
}
function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }

function steckbriefHtml(d, test) {
  const ber = BER[d.layer];
  const rel = REL[d.id];
  const heute = new Date();
  const heuteKey = heute.toISOString().slice(0, 10);
  const daten = (d.daten || []).slice().sort((a, b) => datumKey(a.datum).localeCompare(datumKey(b.datum)));
  let datenHtml = "", heuteGesetzt = false; // Marke „heute“ zwischen vergangenen und kommenden Daten
  daten.forEach((x) => {
    const k = datumKey(x.datum);
    if (!heuteGesetzt && k > heuteKey) {
      datenHtml += `<li class="heute">heute</li>`;
      heuteGesetzt = true;
    }
    datenHtml += `<li class="${k <= heuteKey ? "vorbei" : ""}"><time datetime="${esc(x.datum)}">${fmtDatum(x.datum)}</time><span>${esc(x.text)}</span></li>`;
  });

  if (!heuteGesetzt && datenHtml) datenHtml += `<li class="heute">heute</li>`;
  const feld = (titel, text, cls = "") => text ? `<section class="${cls}"><h3>${titel}</h3><p>${esc(text)}</p></section>` : "";
  const statusMarke = d.status === "aktiv" ? `<span class="aktiv">aktiv</span>` : badge(d.status);
  const geschwister = DATA.filter((x) => x.layer === d.layer);
  const i = geschwister.indexOf(d);
  const vor = geschwister[i - 1], nach = geschwister[i + 1];
  const parent = d.parent && byId[d.parent];
  const kids = KIDS[d.id] || [];

  return `
  <div class="sb-nav">
    <button type="button" class="btn ghost" data-schliessen><svg aria-hidden="true"><use href="#i-zurueck"/></svg>Landkarte</button>
    <span class="krumen"><a href="?ansicht=karte#b-${esc(d.layer)}" data-zu-bereich="${esc(d.layer)}">${esc(ber?.name || d.layer)}</a>${parent ? ` › <a href="?baustein=${esc(parent.id)}" data-id="${esc(parent.id)}">${esc(parent.name)}</a>` : ""}</span>
  </div>
  <header class="sb-kopf">
    <h2 id="sb-name" tabindex="-1">${esc(d.name)}</h2>
    ${d.aka && d.aka.length ? `<p class="sb-aka">Auch: ${d.aka.map(esc).join(" · ")}</p>` : ""}
    <p class="sb-kurz">${esc(d.kurz)}</p>
    <div class="sb-meta">
      ${statusMarke}
      ${d.statusText ? `<span>${esc(d.statusText)}</span>` : ""}
      <span class="beleg"><span class="probe b-${esc(d.belegt)}" aria-hidden="true"></span>${esc(BELEG[d.belegt] || d.belegt)}</span>
    </div>
  </header>
  <div class="sb-grid">
    <div class="sb-text">
      ${feld("Was es leistet", d.was)}
      ${feld("Wie es funktioniert", d.wie)}
      ${feld("Bezug zu S/4HANA", d.s4)}
      ${feld("Wann man es einsetzt", d.wann)}
      ${test ? feld("Testperspektive", d.test, "test") : ""}
      ${feld("Lizenz und Paketierung", d.lizenz)}
      <section class="hinweis">
        <h3>Belegstatus</h3>
        <div class="beleg-zeile"><span class="probe b-${esc(d.belegt)}" aria-hidden="true"></span>${esc(BELEG[d.belegt] || d.belegt)}</div>
        ${d.hinweis ? `<p>${esc(d.hinweis)}</p>` : ""}
      </section>
      <section>
        <h3>Quellen</h3>
        ${d.quellen && d.quellen.length
          ? `<ol class="quellen">${d.quellen.map((q) => `<li><a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.titel)}<svg aria-hidden="true"><use href="#i-extern"/></svg><span class="visually-hidden"> (öffnet in neuem Tab)</span></a><span class="host">${esc(host(q.url))}</span></li>`).join("")}</ol>`
          : `<p>Keine Quelle hinterlegt.</p>`}
      </section>
    </div>
    <aside class="sb-seite" aria-label="Einordnung">
      ${datenHtml ? `<section><h3>Daten</h3><ol class="daten">${datenHtml}</ol></section>` : ""}
      <section>
        ${kids.length ? `<h3>Einzelprodukte</h3><ul class="rel-liste">${kids.map((k) => `<li>${bsKnopf(k)}</li>`).join("")}</ul>` : ""}
        ${parent ? `<h3>Gehört zu</h3><ul class="rel-liste"><li>${bsKnopf(parent)}</li></ul>` : ""}
        ${rel.eigen.length ? `<h3>Verwandte Bausteine</h3><ul class="rel-liste">${rel.eigen.map((id) => `<li>${bsKnopf(byId[id], { heimat: byId[id].layer !== d.layer })}</li>`).join("")}</ul>` : ""}
        ${rel.rueck.length ? `<h3>Verweisen hierher</h3><ul class="rel-liste" id="rueck">${rel.rueck.map((id, n) => `<li ${n >= 6 ? "hidden data-mehr" : ""}>${bsKnopf(byId[id], { heimat: byId[id].layer !== d.layer })}</li>`).join("")}</ul>
          ${rel.rueck.length > 6 ? `<button type="button" class="linkbtn mehr" data-mehr-zeigen aria-controls="rueck">Alle ${rel.rueck.length} zeigen</button>` : ""}` : ""}
      </section>
    </aside>
  </div>
  <nav class="sb-fuss" aria-label="Im selben Bereich blättern">
    ${vor ? `<button type="button" class="btn ghost" data-id="${esc(vor.id)}"><svg aria-hidden="true"><use href="#i-zurueck"/></svg><span>${esc(vor.name)}</span></button>` : "<span></span>"}
    ${nach ? `<button type="button" class="btn ghost" data-id="${esc(nach.id)}"><span>${esc(nach.name)}</span><svg aria-hidden="true"><use href="#i-weiter"/></svg></button>` : ""}
  </nav>`;
}

/* ---------- Ansicht zeigen ---------- */

let letzteAnsicht = null;
let letzterBaustein = null;
let rueckFokus = null;

function zeigen() {
  const z = lesen();
  const vk = $("#view-karte"), vs = $("#view-steckbrief"), vp = $("#view-platzhalter");

  // Kopf
  $$("#tabs a").forEach((a) => {
    if (a.dataset.ansicht === z.ansicht && !z.baustein) a.setAttribute("aria-current", "page");
    else if (a.dataset.ansicht === z.ansicht) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
    a.href = url({ ansicht: a.dataset.ansicht, q: z.q, test: z.test });
  });
  const tp = $("#testperspektive");
  tp.setAttribute("aria-checked", String(z.test));
  const qEl = $("#q");
  if (document.activeElement !== qEl && qEl.value !== z.q) qEl.value = z.q;

  if (!DATA.length) return;

  filtern();

  const war = { a: letzteAnsicht, b: letzterBaustein };
  letzteAnsicht = z.ansicht; letzterBaustein = z.baustein;

  if (z.baustein) {
    const d = byId[z.baustein];
    vk.hidden = true; vp.hidden = true; vs.hidden = false;
    document.body.classList.add("sb-offen");
    if (d) {
      zuletzt = d.id;
      vs.innerHTML = steckbriefHtml(d, z.test);
      document.title = `${d.name} · S/4HANA-Landkarte`;
    } else {
      vs.innerHTML = `<div class="sb-nav"><button type="button" class="btn ghost" data-schliessen><svg aria-hidden="true"><use href="#i-zurueck"/></svg>Landkarte</button></div>
        <div class="fehlt"><h2 id="sb-name" tabindex="-1">Baustein nicht gefunden</h2><p>Zur Kennung „${esc(z.baustein)}“ gibt es keinen Steckbrief. Vielleicht wurde er umbenannt; die Suche hilft weiter.</p></div>`;
      document.title = "Baustein nicht gefunden · S/4HANA-Landkarte";
    }
    registerAktiv(d ? d.layer : null);
    if (war.b !== z.baustein) {
      window.scrollTo(0, 0);
      $("#sb-name").focus({ preventScroll: true });
    }
    return;
  }

  document.body.classList.remove("sb-offen");
  vs.hidden = true; vs.innerHTML = "";

  if (z.ansicht === "karte") {
    vp.hidden = true; vk.hidden = false;
    document.title = "S/4HANA-Landkarte";
    mauerwerk(true);
    markieren();
    registerAktiv(null);
    if (war.b) {
      // vom Steckbrief zurück: Position und Fokus wiederherstellen
      const st = history.state || {};
      const gemerkt = rueckFokus && document.contains(rueckFokus) && rueckFokus.closest("#karte") && rueckFokus.dataset.id === st.anker ? rueckFokus : null;
      const ziel = gemerkt || $(`#karte .bs[data-id="${CSS.escape(st.anker || war.b)}"]`) || null;
      if (ziel && ziel.offsetParent && typeof st.ankerTop === "number") {
        // gleiche Lage im Fenster wie beim Öffnen, auch wenn sich oben etwas verschoben hat
        window.scrollTo(0, window.scrollY + ziel.getBoundingClientRect().top - st.ankerTop);
      } else if (typeof st.scroll === "number") window.scrollTo(0, st.scroll);
      else if (ziel) ziel.scrollIntoView({ block: "center" });
      if (ziel && ziel.offsetParent) ziel.focus({ preventScroll: true });
      else if (rueckFokus && document.contains(rueckFokus)) rueckFokus.focus({ preventScroll: true });
    } else if (war.a !== null && war.a !== "karte") {
      window.scrollTo(0, 0);
    }
  } else {
    vk.hidden = true; vp.hidden = false;
    $("#ph-titel").textContent = ANSICHTEN[z.ansicht];
    document.title = `${ANSICHTEN[z.ansicht]} · S/4HANA-Landkarte`;
    registerAktiv(null);
    if (war.a !== z.ansicht) window.scrollTo(0, 0);
  }
}

function registerAktiv(lid) {
  $$("#register a").forEach((a) => {
    if (lid && a.dataset.sprung === lid) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

/* Register zeigt, welche Bereiche gerade im Blick sind */
function beobachten() {
  const sichtbar = new Set();
  const io = new IntersectionObserver((eintraege) => {
    eintraege.forEach((e) => {
      const lid = e.target.dataset.bereich;
      if (e.isIntersecting) sichtbar.add(lid); else sichtbar.delete(lid);
    });
    const an = !$("#view-karte").hidden;
    $$("#register a, #sprung a").forEach((a) => a.classList.toggle("im-blick", an && sichtbar.has(a.dataset.sprung)));
    // mobile Sprungleiste: ersten sichtbaren Bereich in ihren eigenen Scrollbereich holen
    const leiste = $("#sprung");
    const erster = $("#sprung a.im-blick");
    if (an && erster && leiste.offsetParent) {
      const l = erster.offsetLeft - 16;
      if (Math.abs(leiste.scrollLeft - l) > 4) leiste.scrollTo({ left: l, behavior: "smooth" });
    }
  }, { rootMargin: "-110px 0px -15% 0px" });
  $$(".bereich").forEach((s) => io.observe(s));
}

/* ---------- Ereignisse ---------- */

function oeffnen(id, ausloeser) {
  if (!byId[id]) return;
  const z = lesen();
  if (z.baustein === id) return;
  const st = history.state || {};
  let tiefe = 1;
  if (!z.baustein) { merkeScroll(ausloeser); rueckFokus = ausloeser || null; }
  else tiefe = st.tiefe ? st.tiefe + 1 : 0; // 0: Steckbrief kam per Direktlink
  gehe({ baustein: id }, { extra: { tiefe } });
}

function schliessen() {
  const st = history.state || {};
  // Kamen wir von der Karte, gehen wir echte Schritte zurück: Verlauf bleibt sauber, Position stimmt.
  if (st.app && st.tiefe > 0) history.go(-st.tiefe);
  else gehe({ baustein: null });
}

document.addEventListener("click", (e) => {
  const knopf = e.target.closest("[data-id]");
  if (knopf && (knopf.matches("button") || knopf.matches("a"))) {
    e.preventDefault();
    oeffnen(knopf.dataset.id, knopf);
    return;
  }
  if (e.target.closest("[data-schliessen]")) { e.preventDefault(); schliessen(); return; }

  const zuB = e.target.closest("[data-zu-bereich], [data-sprung]");
  if (zuB) {
    e.preventDefault();
    const lid = zuB.dataset.zuBereich || zuB.dataset.sprung;
    const z = lesen();
    if (z.baustein || z.ansicht !== "karte") gehe({ baustein: null, ansicht: "karte" }, { extra: {} });
    const sec = $("#b-" + lid);
    if (sec && !sec.hidden) {
      sec.scrollIntoView({ block: "start" });
      const h = $("h3", sec); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
    }
    return;
  }

  const tab = e.target.closest("#tabs a, [data-nav]");
  if (tab && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    const ansicht = tab.dataset.ansicht || tab.dataset.nav || "karte";
    const z = lesen();
    if (z.ansicht === ansicht && !z.baustein) return;
    if (!z.baustein && z.ansicht === "karte") merkeScroll();
    gehe({ ansicht, baustein: null });
    return;
  }

  const mehr = e.target.closest("[data-mehr-zeigen]");
  if (mehr) {
    const liste = $("#rueck");
    const erstes = $("li[data-mehr]", liste);
    $$("li[data-mehr]", liste).forEach((li) => { li.hidden = false; li.removeAttribute("data-mehr"); });
    mehr.remove();
    if (erstes) $(".bs", erstes).focus();
    return;
  }
  if (e.target.closest("#spur-weg")) { zuletzt = null; markieren(); return; }
  if (e.target.closest("#leer-reset")) { sucheSetzen(""); $("#q").focus(); return; }
  // Klick ins Leere: bewusst keine Wirkung auf Auswahl oder Markierung.
});

function sucheSetzen(wert) {
  const z = lesen();
  const neu = { q: wert };
  if (z.baustein || z.ansicht !== "karte") { neu.baustein = null; neu.ansicht = "karte"; }
  const beginnt = !sucheAktivSeit || z.baustein || z.ansicht !== "karte";
  if (beginnt && wert) {
    sucheAktivSeit = location.href;
    gehe(neu);
  } else {
    gehe(neu, { ersetzen: true });
  }
  if (!wert) sucheAktivSeit = null;
  if (!z.baustein) window.scrollTo({ top: 0 });
}

const qEl = $("#q");
qEl.addEventListener("input", () => sucheSetzen(qEl.value.trim() ? qEl.value : ""));
qEl.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault(); e.stopPropagation();
    if (qEl.value) { qEl.value = ""; sucheSetzen(""); }
  }
  if (e.key === "Enter") {
    e.preventDefault();
    const erster = $("#karte .bs:not(.kontext)");
    if (erster && lesen().q) erster.focus();
  }
});

document.addEventListener("keydown", (e) => {
  const tippt = e.target.closest("input, textarea, select, [contenteditable]");
  if (e.key === "/" && !tippt) { e.preventDefault(); qEl.focus(); qEl.select(); }
  if (e.key === "Escape" && !tippt && lesen().baustein) { e.preventDefault(); schliessen(); }
});

$("#testperspektive").addEventListener("click", () => {
  gehe({ test: !lesen().test }, { ersetzen: true, extra: history.state || {} });
});

function themeSetzen(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("lk-theme", t); } catch (e) {}
  const b = $("#theme");
  const dunkel = t === "dunkel";
  b.setAttribute("aria-label", dunkel ? "Helles Design" : "Dunkles Design");
  b.title = dunkel ? "Helles Design" : "Dunkles Design";
  $("use", b).setAttribute("href", dunkel ? "#i-sonne" : "#i-mond");
}
$("#theme").addEventListener("click", () => themeSetzen(document.documentElement.dataset.theme === "dunkel" ? "hell" : "dunkel"));
themeSetzen(document.documentElement.dataset.theme || "hell");

const einstieg = $("#einstieg");
// Standard: zu, damit die Karte im ersten Blick steht; der Zustand wird gemerkt.
try { einstieg.open = localStorage.getItem("lk-einstieg") === "auf"; } catch (e) { einstieg.open = false; }
einstieg.addEventListener("toggle", () => { try { localStorage.setItem("lk-einstieg", einstieg.open ? "auf" : "zu"); } catch (e) {} mauerwerk(true); });

window.addEventListener("popstate", zeigen);
let rz;
window.addEventListener("resize", () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => mauerwerk()); });

/* ---------- Start ---------- */

history.scrollRestoration = "manual";
$("#stand").textContent = `${STAND} · Steckbriefe werden geladen`;

fetch("../../../data/steckbriefe.json")
  .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then((data) => {
    aufbereiten(data);
    $("#stand").textContent = `${STAND} · ${DATA.length} Steckbriefe in ${BEREICHE.length} Bereichen`;
    const L = (id) => byId[id] ? `<a href="?baustein=${esc(id)}" data-id="${esc(id)}">${esc(byId[id].name)}</a>` : "";
    $("#einstieg-body").innerHTML = EINSTIEG(L);
    registerBauen();
    karteBauen();
    beobachten();
    if (!history.state) history.replaceState({ app: true }, "", location.href);
    zeigen();
  })
  .catch((err) => {
    $("#karte").innerHTML = `<div class="leer"><p><strong>Die Steckbriefe konnten nicht geladen werden.</strong></p><p>Die Seite braucht einen lokalen Webserver (z. B. <code>python3 -m http.server</code> im Projektordner). Fehler: ${esc(err.message)}</p></div>`;
    $("#karte").removeAttribute("aria-busy");
    $("#stand").textContent = STAND;
  });
