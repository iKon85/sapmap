// S/4HANA-Landkarte, Alternativen "taste-1..3": gemeinsamer Kern.
// Daten laden und verknüpfen, Zustand in der URL, Bausteine des Steckbriefs.

const DATEN_URL = '../../../data/steckbriefe.json';
const FLUSS_URL = '../../../data/toolchain-flows.json';
export const STAND = 'Oktober 2026'; // die Daten tragen kein Stand-Feld (Bestandsaufnahme N6)

export const BEREICHE = [
  ['core', 'S/4HANA-Kern & Deployment'],
  ['ext', 'Clean Core & Erweiterbarkeit'],
  ['btp', 'Plattform & Entwicklung'],
  ['ai', 'Business AI & Joule'],
  ['int', 'Integration'],
  ['data', 'Daten & Analytics'],
  ['lob', 'LoB-Cloud-Apps & Branchen'],
  ['tool', 'Toolchain, ALM & Test'],
  ['mig', 'Migration & Transformation'],
  ['pm', 'Einführungsprojekt steuern'],
  ['sec', 'Security, Identity & GRC'],
  ['ops', 'Betrieb & Infrastruktur'],
];
export const BEREICH = Object.fromEntries(BEREICHE);
export const STATUS = { aktiv: 'aktiv', neu: 'neu', umbenannt: 'umbenannt', auslaufend: 'läuft aus', abgekuendigt: 'abgekündigt' };
export const BELEGT = { ja: 'belegt', teilweise: 'teilweise belegt', nein: 'nicht belegt' };
const MONATE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];

export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------ Daten */
// DATA: alle Steckbriefe; AUS: eigene Verweise; EIN: Rückverweise (wer mich nennt, ohne dass ich ihn nenne);
// FLUSS: Übergaben der Toolchain je Baustein ({von, nach, was, richtung}).
export const K = { DATA: [], byId: {}, KINDER: {}, AUS: {}, EIN: {}, REL: {}, FLUSS: {}, FLUESSE: [], SUCH: {} };

export async function laden() {
  const [r1, r2] = await Promise.all([fetch(DATEN_URL), fetch(FLUSS_URL)]);
  if (!r1.ok) throw new Error('steckbriefe.json: ' + r1.status);
  const daten = await r1.json();
  const fluesse = r2.ok ? await r2.json() : [];
  K.DATA = daten;
  K.byId = Object.fromEntries(daten.map(d => [d.id, d]));
  daten.forEach(d => { if (d.parent && K.byId[d.parent]) (K.KINDER[d.parent] ||= []).push(d.id); });
  daten.forEach(d => { K.AUS[d.id] = (d.verwandt || []).filter(x => K.byId[x] && x !== d.id); K.EIN[d.id] = []; });
  daten.forEach(d => K.AUS[d.id].forEach(x => { if (!K.AUS[x].includes(d.id)) K.EIN[x].push(d.id); }));
  daten.forEach(d => { K.REL[d.id] = new Set([...K.AUS[d.id], ...K.EIN[d.id]]); K.FLUSS[d.id] = []; });
  K.FLUESSE = fluesse.filter(f => K.byId[f.von] && K.byId[f.nach]);
  K.FLUESSE.forEach(f => { K.FLUSS[f.von].push(f); if (f.nach !== f.von) K.FLUSS[f.nach].push(f); });
  const norm = s => String(s || '').toLocaleLowerCase('de');
  daten.forEach(d => {
    K.SUCH[d.id] = norm([d.id, d.name, ...(d.aka || []), d.kurz, d.was, d.wie, d.s4, d.wann, d.lizenz, d.statusText, BEREICH[d.layer]].join(' \u0001 '));
  });
  return K;
}

// Treffer der Suche: null ohne Suchwort, sonst die Menge der passenden IDs (alle Wörter müssen vorkommen)
export function treffer(q) {
  const woerter = String(q || '').trim().toLocaleLowerCase('de').split(/\s+/).filter(Boolean);
  if (!woerter.length) return null;
  return new Set(K.DATA.filter(d => woerter.every(w => K.SUCH[d.id].includes(w))).map(d => d.id));
}
// Rang für Ergebnislisten: Name beginnt mit dem Suchwort, dann Name enthält es, dann Volltext
export function rang(d, q) {
  const w = String(q || '').trim().toLocaleLowerCase('de');
  const n = [d.name, ...(d.aka || [])].join(' \u0001 ').toLocaleLowerCase('de');
  if (d.name.toLocaleLowerCase('de').startsWith(w)) return 0;
  if (n.includes(w)) return 1;
  return 2;
}

/* ------------------------------------------------------------ Datum */
export function heuteIso() { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
export function datumText(s) {
  const m = String(s).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return esc(s);
  const [, y, mo, t] = m;
  if (t) return `${Number(t)}. ${MONATE[Number(mo) - 1]} ${y}`;
  if (mo) return `${MONATE[Number(mo) - 1]} ${y}`;
  return y;
}
// ein Termin liegt vor uns, wenn er in seiner eigenen Genauigkeit (Jahr, Monat oder Tag) nach heute liegt
export function istZukunft(datum, heute = heuteIso()) { const s = String(datum); return s > heute.slice(0, s.length); }
// Wartungsende oder Frist, am Text erkannt (Regel der alten Seite, isEol)
export function istFrist(t) { return /wartung|support-ende|supportende|nutzungsrecht|abgek(ü|ue)ndigt|eingestellt|auslauf|end of life|lebensende|stillleg|deprecat|endet|end-of|retire|^ende\b|\bende (der|des|von)\b|vor ende\b|verbindlich|(?<!kosten)pflicht|\bfrist/i.test(t); }

/* ------------------------------------------------------------ Zustand in der URL */
// vorgaben: { b: '', q: '', test: false, ... }; ein Wert, der der Vorgabe gleicht, steht nicht in der Adresse
export const zustand = {};
let VORGABEN = {};
export function zustandAnlegen(vorgaben) { VORGABEN = { b: '', q: '', test: false, ...vorgaben }; Object.assign(zustand, VORGABEN); }
export function urlLesen() {
  const p = new URLSearchParams(location.search);
  for (const [k, v] of Object.entries(VORGABEN)) {
    if (typeof v === 'boolean') zustand[k] = p.get(k) === '1';
    else zustand[k] = p.get(k) ?? v;
  }
  if (zustand.b && !K.byId[zustand.b]) zustand.b = '';
}
export function urlFuer(neu = {}) {
  const z = { ...zustand, ...neu };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(VORGABEN)) {
    if (typeof v === 'boolean') { if (z[k]) p.set(k, '1'); }
    else if (z[k] && z[k] !== v) p.set(k, z[k]);
  }
  const s = p.toString();
  return location.pathname + (s ? '?' + s : '');
}
export function urlSchreiben(art) {
  const url = urlFuer();
  if (url === location.pathname + location.search) return;
  history[art === 'push' ? 'pushState' : 'replaceState']({ app: true }, '', url);
}

/* ------------------------------------------------------------ Bausteine des Steckbriefs */
export function statusTag(d, immer = false) {
  if (d.status === 'aktiv' && !immer) return '';
  return `<span class="status" data-status="${esc(d.status)}">${esc(STATUS[d.status] || d.status)}</span>`;
}
// Status als kleines Kennzeichen; aktiv bleibt ohne Zeichen
export function marke(d) {
  if (d.status === 'aktiv') return '';
  const wort = STATUS[d.status] || d.status;
  return `<span class="marke" data-status="${esc(d.status)}" role="img" aria-label="${esc(wort)}" title="${esc(wort)}"></span>`;
}
export function chip(id, art = '') {
  const d = K.byId[id];
  if (!d) return '';
  return `<a class="chip" href="${esc(urlFuer({ b: id }))}" data-id="${esc(id)}">${esc(d.name)}${art ? `<span class="chip__art">${esc(art)}</span>` : ''}</a>`;
}
const host = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };
export const feld = (titel, text) => text ? `<section class="sb__feld"><h3>${titel}</h3><p>${esc(text)}</p></section>` : '';

export function sbTitel(d, { tag = 'h2', id = 'sb-name' } = {}) {
  return `<p class="sb__bereich">${esc(BEREICH[d.layer] || d.layer)}</p>
    <${tag} class="sb__name" id="${id}" tabindex="-1">${esc(d.name)}</${tag}>
    ${(d.aka || []).length ? `<p class="sb__aka">Auch: ${d.aka.map(esc).join(' · ')}</p>` : ''}`;
}
export function sbStatus(d) {
  return `<div class="sb__status">${statusTag(d, true)}${d.statusText ? `<p>${esc(d.statusText)}</p>` : ''}</div>`;
}
export function sbFelder(d) {
  return feld('Was es leistet', d.was) + feld('Wie es funktioniert', d.wie) + feld('Bezug zu S/4HANA', d.s4) + feld('Wann man es einsetzt', d.wann);
}
export function testSchalter(extra = '') {
  return `<button class="schalter" type="button" role="switch" aria-checked="${zustand.test}" data-test-schalter aria-label="Testperspektive" ${extra}><span class="schalter__spur" aria-hidden="true"></span><span class="schalter__wert">${zustand.test ? 'an' : 'aus'}</span></button>`;
}
// beide Fassungen stehen im Dokument; html[data-test] entscheidet, welche zu sehen ist (kein Neuzeichnen beim Umschalten)
export function sbTest(d) {
  return `<section class="sb__test"><div class="sb__testkopf"><h3>Testperspektive</h3>${testSchalter()}</div>
    <p class="sb__test-an">${esc(d.test)}</p>
    <p class="sb__test-aus">Ausgeblendet. Der Schalter zeigt, was der Baustein für Test und Qualität bedeutet.</p></section>`;
}
export function sbDaten(d, gewaehlt = '') {
  const daten = [...(d.daten || [])].sort((a, b) => String(a.datum).localeCompare(String(b.datum)));
  if (!daten.length) return '';
  const heute = heuteIso();
  return `<section class="sb__feld"><h3>Daten</h3><ol class="daten">${daten.map(e =>
    `<li class="${istZukunft(e.datum, heute) ? 'ist-zukunft' : ''}${gewaehlt && gewaehlt === e.datum + '|' + e.text ? ' ist-gewaehlt' : ''}"><time datetime="${esc(e.datum)}">${datumText(e.datum)}</time><span>${esc(e.text)}</span></li>`).join('')}</ol></section>`;
}
export function sbVerwandt(d) {
  const dach = d.parent && K.byId[d.parent] ? d.parent : null;
  const kinder = K.KINDER[d.id] || [];
  const aus = K.AUS[d.id], ein = K.EIN[d.id];
  return (dach ? `<section class="sb__feld"><h3>Gehört zu</h3><div class="chips">${chip(dach)}</div></section>` : '') +
    (kinder.length ? `<section class="sb__feld"><h3>Produkte im Portfolio</h3><div class="chips">${kinder.map(id => chip(id)).join('')}</div></section>` : '') +
    (aus.length + ein.length ? `<section class="sb__feld"><h3>Verwandt</h3><div class="chips">${aus.map(id => chip(id)).join('')}${ein.map(id => chip(id, 'verweist hierher')).join('')}</div></section>` : '');
}
export function sbBeleg(d) {
  return `<section class="sb__belegbox" data-belegt="${esc(d.belegt)}"><h3>Belegstatus: ${esc(BELEGT[d.belegt] || d.belegt)}</h3>${d.hinweis ? `<p>${esc(d.hinweis)}</p>` : ''}</section>`;
}
export function sbQuellen(d) {
  if (!(d.quellen || []).length) return '';
  return `<section class="sb__feld"><h3>Quellen</h3><ol class="quellen">${d.quellen.map(q =>
    `<li><span><a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.titel)}</a><span class="quellen__host">${esc(host(q.url))}</span></span></li>`).join('')}</ol></section>`;
}

/* ------------------------------------------------------------ Bedienung, die alle drei teilen */
export function testZeigen() {
  document.documentElement.dataset.test = zustand.test ? 'an' : 'aus';
  $$('[data-test-schalter]').forEach(b => {
    b.setAttribute('aria-checked', String(zustand.test));
    const w = $('.schalter__wert', b); if (w) w.textContent = zustand.test ? 'an' : 'aus';
  });
}
// waehle(id, ausloeser): ein Klick auf einen Baustein-Link; nachTest(): nach dem Umschalten der Testperspektive
export function anbinden({ waehle, nachTest }) {
  themaSetzen(document.documentElement.classList.contains('dark'));
  document.addEventListener('click', e => {
    if (e.defaultPrevented) return;
    const a = e.target.closest('a[data-id]');
    if (a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      waehle(a.dataset.id, a);
      return;
    }
    if (e.target.closest('[data-thema]')) { themaSetzen(!document.documentElement.classList.contains('dark'), true); return; }
    if (e.target.closest('[data-test-schalter]')) {
      zustand.test = !zustand.test;
      urlSchreiben('replace');
      testZeigen();
      nachTest?.();
    }
  });
}
// Hell/Dunkel nach shadcn-Muster: Klasse .dark an <html>; der Kopf der Seite setzt sie vor dem ersten Zeichnen
export function themaSetzen(dunkel, merken = false) {
  document.documentElement.classList.toggle('dark', dunkel);
  if (merken) { try { localStorage.setItem('landkarte-thema', dunkel ? 'dunkel' : 'hell'); } catch { /* ohne Speicher gilt die Wahl bis zum Neuladen */ } }
  $$('[data-thema]').forEach(b => { b.setAttribute('aria-pressed', String(dunkel)); });
  const farbe = $('meta[name="theme-color"]'); if (farbe) farbe.content = dunkel ? '#0D0826' : '#FFFFFF';
}
export function linksAktualisieren() { $$('a[data-id]').forEach(a => { a.href = urlFuer({ b: a.dataset.id }); }); }
export function ansage(text) { const el = $('#ansage'); if (el) el.textContent = text; }
export function ladefehler(el, err) {
  el.innerHTML = `<div class="leer"><h2>Daten nicht geladen</h2><p>Die Datei data/steckbriefe.json ließ sich nicht laden. Die Seite muss über einen Webserver aus dem Repo-Wurzelordner laufen.</p></div>`;
  console.warn('Landkarte: Daten nicht geladen', err);
}
