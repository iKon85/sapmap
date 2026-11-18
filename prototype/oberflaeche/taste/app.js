// S/4HANA-Landkarte, Prototyp "taste". Zustand steht in der URL (?ansicht, ?b, ?q, ?test),
// Zurück/Vor stellt ihn wieder her. Daten: data/steckbriefe.json im Repo-Wurzelordner.

const DATEN_URL = '../../../data/steckbriefe.json';
const STAND = 'Oktober 2026'; // die Daten tragen kein Stand-Feld (Bestandsaufnahme N6)

const BEREICHE = [
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
const BEREICH = Object.fromEntries(BEREICHE);

const ANSICHTEN = {
  karte: { name: 'Landkarte' },
  schichten: { name: 'Schichtenmodell', was: 'Ein Architekturbild: unten Infrastruktur und Datenbank, darauf der S/4HANA-Kern mit seiner Clean-Core-Grenze, darüber Integration und Anwendungen.' },
  integration: { name: 'Integrationswege', was: 'Wie Daten, Ereignisse und Benutzer zwischen S/4HANA und dem Rest der Landschaft fließen, mit der Technik an jeder Verbindung.' },
  toolchain: { name: 'Toolchain', was: 'Welches Werkzeug in welcher Activate-Phase arbeitet und was es an welches andere Werkzeug übergibt.' },
  zeitleiste: { name: 'Zeitleiste', was: 'Alle Termine aus den Steckbriefen auf einer Achse, mit Wartungsenden und Umbenennungen.' },
};

const STATUS = { aktiv: 'aktiv', neu: 'neu', umbenannt: 'umbenannt', auslaufend: 'läuft aus', abgekuendigt: 'abgekündigt' };
const BELEGT = { ja: 'belegt', teilweise: 'teilweise belegt', nein: 'nicht belegt' };
const MONATE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];

const $ = (sel, el = document) => el.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mobil = window.matchMedia('(max-width: 899px)');

let DATA = [], byId = {}, KINDER = {}, REL = {}, RUECK = {}, SUCHTEXT = {};
const zustand = { ansicht: 'karte', b: null, q: '', test: false };
let letzterAusloeser = null;

/* ------------------------------------------------------------ URL */
function ausUrl() {
  const p = new URLSearchParams(location.search);
  const a = p.get('ansicht');
  zustand.ansicht = ANSICHTEN[a] ? a : 'karte';
  const b = p.get('b');
  zustand.b = b && byId[b] ? b : null;
  zustand.q = p.get('q') || '';
  zustand.test = p.get('test') === '1';
}
function urlFuer(neu = {}) {
  const z = { ...zustand, ...neu };
  const p = new URLSearchParams();
  if (z.ansicht !== 'karte') p.set('ansicht', z.ansicht);
  if (z.b) p.set('b', z.b);
  if (z.q) p.set('q', z.q);
  if (z.test) p.set('test', '1');
  const s = p.toString();
  return location.pathname + (s ? '?' + s : '');
}
function schreibeUrl(art) {
  const url = urlFuer();
  if (url === location.pathname + location.search) return;
  history[art === 'push' ? 'pushState' : 'replaceState']({ app: true }, '', url);
}

/* ------------------------------------------------------------ Daten vorbereiten */
function vorbereiten(daten) {
  DATA = daten;
  byId = Object.fromEntries(DATA.map(d => [d.id, d]));
  KINDER = {};
  DATA.forEach(d => { if (d.parent && byId[d.parent]) (KINDER[d.parent] ||= []).push(d.id); });
  // Rückverweise: wer mich als verwandt nennt, ist auch mit mir verwandt
  REL = {}; RUECK = {};
  DATA.forEach(d => { REL[d.id] = new Set((d.verwandt || []).filter(x => byId[x] && x !== d.id)); RUECK[d.id] = new Set(); });
  DATA.forEach(d => REL[d.id].forEach(x => { if (!REL[x].has(d.id)) RUECK[x].add(d.id); }));
  DATA.forEach(d => RUECK[d.id].forEach(x => REL[d.id].add(x)));
  const norm = s => String(s || '').toLocaleLowerCase('de');
  DATA.forEach(d => {
    SUCHTEXT[d.id] = norm([d.id, d.name, ...(d.aka || []), d.kurz, d.was, d.wie, d.s4, d.wann, d.lizenz, d.statusText, BEREICH[d.layer]].join(' \u0001 '));
  });
}

/* ------------------------------------------------------------ Einstieg */
function einstiegFuellen() {
  const n = DATA.length;
  const aus = DATA.filter(d => d.status === 'auslaufend' || d.status === 'abgekuendigt').length;
  const zahl = k => DATA.filter(d => d.belegt === k).length;
  $('#f-bausteine').textContent = n;
  $('#f-bereiche').textContent = new Set(DATA.map(d => d.layer)).size;
  $('#f-aus').textContent = aus;
  $('#f-unbelegt').textContent = zahl('teilweise') + zahl('nein');
  $('#lead-zahl').textContent = n;
  $('#l-ja').textContent = zahl('ja');
  $('#l-teilweise').textContent = zahl('teilweise');
  $('#l-nein').textContent = zahl('nein');
}

/* ------------------------------------------------------------ Landkarte */
function statusTag(d) {
  if (d.status === 'aktiv') return '';
  return `<span class="status" data-status="${esc(d.status)}">${esc(STATUS[d.status] || d.status)}</span>`;
}
function kachel(d) {
  const beleg = d.belegt !== 'ja' ? `<span class="vh">, ${esc(BELEGT[d.belegt])}</span>` : '';
  return `<a class="kachel" href="${esc(urlFuer({ b: d.id, ansicht: 'karte' }))}" data-id="${esc(d.id)}" data-belegt="${esc(d.belegt)}">` +
    `<span class="kachel__name">${esc(d.name)}<span class="vh" data-rel-hinweis></span>${beleg}</span>${statusTag(d)}</a>`;
}
function eintrag(d) {
  const kinder = (KINDER[d.id] || []).map(id => byId[id]);
  const sub = kinder.length ? `<ul class="liste" aria-label="Produkte von ${esc(d.name)}">${kinder.map(eintrag).join('')}</ul>` : '';
  return `<li class="eintrag" data-eintrag="${esc(d.id)}">${kachel(d)}${sub}</li>`;
}
function karteBauen() {
  const html = BEREICHE.map(([key, name]) => {
    const alle = DATA.filter(d => d.layer === key);
    if (!alle.length) return '';
    // Dach-Steckbriefe mit ihren Produkten; ein Produkt, dessen Dach in einem anderen Bereich liegt, steht oben
    const wurzeln = alle.filter(d => !(d.parent && byId[d.parent] && byId[d.parent].layer === key));
    return `<section class="bereich" data-bereich="${key}" aria-labelledby="b-${key}">
      <div class="bereich__kopf"><h2 id="b-${key}">${esc(name)}</h2><span class="bereich__zahl" data-zahl="${key}">${alle.length}</span></div>
      <ul class="liste">${wurzeln.map(eintrag).join('')}</ul>
    </section>`;
  }).join('');
  $('#karte').innerHTML = html;
}

function filtern() {
  const q = zustand.q.trim().toLocaleLowerCase('de');
  const woerter = q.split(/\s+/).filter(Boolean);
  const passt = d => woerter.every(w => SUCHTEXT[d.id].includes(w));
  let treffer = 0;
  const sichtbar = new Set();
  DATA.forEach(d => { if (!woerter.length || passt(d)) { sichtbar.add(d.id); treffer++; } });
  // ein Dach bleibt als Kontext stehen, wenn nur eines seiner Produkte passt
  const kontext = new Set();
  sichtbar.forEach(id => { const p = byId[id].parent; if (p && byId[p] && !sichtbar.has(p)) kontext.add(p); });

  document.querySelectorAll('.eintrag').forEach(li => {
    const id = li.dataset.eintrag;
    li.hidden = !(sichtbar.has(id) || kontext.has(id));
    li.querySelector(':scope > .kachel').classList.toggle('ist-kontext', kontext.has(id));
  });
  BEREICHE.forEach(([key]) => {
    const sec = $(`[data-bereich="${key}"]`);
    if (!sec) return;
    const alle = DATA.filter(d => d.layer === key);
    const n = alle.filter(d => sichtbar.has(d.id)).length;
    sec.hidden = woerter.length > 0 && n === 0;
    $(`[data-zahl="${key}"]`).textContent = woerter.length ? `${n} von ${alle.length}` : String(alle.length);
  });
  const text = woerter.length ? (treffer === 1 ? '1 Treffer' : `${treffer} Treffer`) : `${DATA.length} Bausteine`;
  $('#trefferzahl').textContent = text;
  $('#trefferzeile').textContent = text;
  const leer = $('#keine-treffer');
  leer.hidden = !(woerter.length && treffer === 0);
  if (!leer.hidden) $('#keine-treffer-q').textContent = zustand.q.trim();
  $('#suche-leeren').hidden = !zustand.q;
}

function hrefsAktualisieren() {
  document.querySelectorAll('a.kachel, a.chip').forEach(a => { a.href = urlFuer({ b: a.dataset.id }); });
  document.querySelectorAll('[data-ansicht-link]').forEach(a => { a.href = urlFuer({ ansicht: a.dataset.ansichtLink }); });
}

function auswahlMarkieren() {
  const rel = zustand.b ? REL[zustand.b] : new Set();
  document.querySelectorAll('#karte a.kachel').forEach(a => {
    const id = a.dataset.id;
    const sel = id === zustand.b;
    if (sel) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    const r = !sel && rel.has(id);
    a.classList.toggle('ist-verwandt', r);
    a.querySelector('[data-rel-hinweis]').textContent = r ? ', verwandt mit der Auswahl' : '';
  });
}

/* ------------------------------------------------------------ Steckbrief */
function datumText(s) {
  const m = String(s).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return esc(s);
  const [, y, mo, t] = m;
  if (t) return `${Number(t)}. ${MONATE[Number(mo) - 1]} ${y}`;
  if (mo) return `${MONATE[Number(mo) - 1]} ${y}`;
  return y;
}
function heuteIso() { const d = new Date(); return d.toISOString().slice(0, 10); }
function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function feld(titel, text) { return text ? `<section class="sb__feld"><h3>${titel}</h3><p>${esc(text)}</p></section>` : ''; }
function chip(id, rueck) {
  const d = byId[id];
  if (!d) return '';
  return `<a class="chip" href="${esc(urlFuer({ b: id }))}" data-id="${esc(id)}">${esc(d.name)}${rueck ? '<span class="chip__rueck">verweist hierher</span>' : ''}</a>`;
}
function testSchalter(id) {
  return `<button class="toggle" type="button" role="switch" aria-checked="${zustand.test}" data-test-schalter id="${id}" aria-label="Testperspektive"><span class="knopf" aria-hidden="true"></span><span class="toggle__wert">${zustand.test ? 'an' : 'aus'}</span></button>`;
}

function steckbriefHtml(d, ort) {
  const daten = [...(d.daten || [])].sort((a, b) => String(a.datum).localeCompare(String(b.datum)));
  const heute = heuteIso();
  const eigene = (d.verwandt || []).filter(x => byId[x] && x !== d.id);
  const rueck = [...RUECK[d.id]];
  const kinder = KINDER[d.id] || [];
  const dach = d.parent && byId[d.parent] ? byId[d.parent] : null;
  const hid = `sb-name-${ort}`;
  const test = zustand.test
    ? `<section class="sb__test sb__test--an" aria-labelledby="t-${ort}"><div class="sb__testkopf"><h3 id="t-${ort}">Testperspektive</h3>${testSchalter('ts-' + ort)}</div><p>${esc(d.test)}</p></section>`
    : `<section class="sb__test sb__test--aus" aria-labelledby="t-${ort}"><div class="sb__testkopf"><h3 id="t-${ort}">Testperspektive</h3>${testSchalter('ts-' + ort)}</div><p>Ausgeblendet. Der Schalter zeigt, was der Baustein für Test und Qualität bedeutet.</p></section>`;

  return `<article class="sb" aria-labelledby="${hid}">
    <div class="sb__zeile">
      <span class="sb__bereich">${esc(BEREICH[d.layer] || d.layer)}</span>
      ${ort === 'seite' ? `<button class="sb__zu" type="button" data-auswahl-weg><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Auswahl aufheben</button>` : ''}
    </div>
    <div class="sb__titel">
      <h2 id="${hid}" tabindex="-1">${esc(d.name)}</h2>
      ${(d.aka || []).length ? `<p class="sb__aka">Auch: ${d.aka.map(esc).join(' · ')}</p>` : ''}
    </div>
    <div class="sb__status">
      <span class="status" data-status="${esc(d.status)}">${esc(STATUS[d.status] || d.status)}</span>
      ${d.statusText ? `<p>${esc(d.statusText)}</p>` : ''}
    </div>
    <p class="sb__kurz">${esc(d.kurz)}</p>
    <a class="sb__beleg" href="#beleg-${ort}" data-sprung="beleg-${ort}"><span class="legende__rahmen" data-belegt="${esc(d.belegt)}" aria-hidden="true"></span>${esc(BELEGT[d.belegt] || d.belegt)}${d.hinweis ? ', mit Hinweis' : ''}</a>
    ${dach ? `<section class="sb__feld"><h3>Gehört zu</h3><div class="chips">${chip(dach.id)}</div></section>` : ''}
    ${kinder.length ? `<section class="sb__feld"><h3>Produkte im Portfolio</h3><div class="chips">${kinder.map(id => chip(id)).join('')}</div></section>` : ''}
    ${feld('Was es leistet', d.was)}
    ${feld('Wie es funktioniert', d.wie)}
    ${feld('Bezug zu S/4HANA', d.s4)}
    ${feld('Wann man es einsetzt', d.wann)}
    ${test}
    ${feld('Lizenz', d.lizenz)}
    ${daten.length ? `<section class="sb__feld"><h3>Daten</h3><ol class="daten">${daten.map(e => `<li class="${String(e.datum) > heute ? 'ist-zukunft' : ''}"><time datetime="${esc(e.datum)}">${datumText(e.datum)}</time><span>${esc(e.text)}</span></li>`).join('')}</ol></section>` : ''}
    ${eigene.length + rueck.length ? `<section class="sb__feld"><h3>Verwandt</h3><div class="chips">${eigene.map(id => chip(id)).join('')}${rueck.map(id => chip(id, true)).join('')}</div></section>` : ''}
    <section class="sb__belegbox" id="beleg-${ort}" data-belegt="${esc(d.belegt)}" aria-labelledby="bl-${ort}">
      <h3 id="bl-${ort}">Belegstatus: ${esc(BELEGT[d.belegt] || d.belegt)}</h3>
      ${d.hinweis ? `<p>${esc(d.hinweis)}</p>` : ''}
    </section>
    ${(d.quellen || []).length ? `<section class="sb__feld"><h3>Quellen</h3><ol class="quellen">${d.quellen.map(q => `<li><span><a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.titel)}</a><span class="quellen__host">${esc(host(q.url))}</span></span></li>`).join('')}</ol></section>` : ''}
  </article>`;
}

function leerHtml() {
  const aus = DATA.filter(d => d.status === 'auslaufend' || d.status === 'abgekuendigt');
  return `<div class="sb-leer">
    <h2>Kein Baustein gewählt</h2>
    <p>Ein Klick auf einen Baustein öffnet hier seinen Steckbrief. Die Adresse in der Browserzeile führt genau zu dieser Auswahl und lässt sich teilen.</p>
    <h3>Läuft aus oder abgekündigt: ${aus.length}</h3>
    <ul class="liste">${aus.map(d => `<li>${kachel(d).replace('class="kachel"', 'class="kachel" data-seite')}</li>`).join('')}</ul>
  </div>`;
}

function steckbriefZeigen(fokus) {
  const d = zustand.b ? byId[zustand.b] : null;
  const seite = $('#seite');
  const blatt = $('#blatt');
  if (mobil.matches) {
    seite.innerHTML = '';
    if (d) {
      $('#blatt-inhalt').innerHTML = steckbriefHtml(d, 'blatt');
      $('#blatt-inhalt').scrollTop = 0;
      if (!blatt.open) blatt.showModal();
      if (fokus) $('#sb-name-blatt').focus({ preventScroll: true });
    } else if (blatt.open) {
      blatt.close();
    }
  } else {
    if (blatt.open) blatt.close();
    seite.innerHTML = d ? steckbriefHtml(d, 'seite') : leerHtml();
    seite.scrollTop = 0;
    if (d && fokus) $('#sb-name-seite').focus({ preventScroll: true });
    // die Kacheln der Leerliste tragen die aktuelle Adresse
    seite.querySelectorAll('a.kachel').forEach(a => { a.href = urlFuer({ b: a.dataset.id }); });
  }
  $('#ansage').textContent = d ? `Steckbrief ${d.name} geöffnet` : '';
}

/* ------------------------------------------------------------ Ansichten */
function ansichtZeigen() {
  const a = zustand.ansicht;
  document.querySelectorAll('#ansichten a').forEach(l => {
    if (l.dataset.ansichtLink === a) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
  });
  $('#ansicht-name').textContent = ANSICHTEN[a].name;
  $('#v-karte').hidden = a !== 'karte';
  const fehlt = $('#v-fehlt');
  fehlt.hidden = a === 'karte';
  if (a !== 'karte') {
    $('#fehlt-titel').textContent = ANSICHTEN[a].name;
    $('#fehlt-was').textContent = ANSICHTEN[a].was;
  }
  document.title = (a === 'karte' ? 'S/4HANA-Landkarte' : `${ANSICHTEN[a].name} · S/4HANA-Landkarte`) +
    (zustand.b ? ` · ${byId[zustand.b].name}` : '') + ': SAP-Bausteine rund um S/4HANA';
}

function testZeigen() {
  document.querySelectorAll('[data-test-schalter]').forEach(b => {
    b.setAttribute('aria-checked', String(zustand.test));
    const w = b.querySelector('.toggle__wert'); if (w) w.textContent = zustand.test ? 'an' : 'aus';
  });
}

function allesZeigen({ fokus = false } = {}) {
  ansichtZeigen();
  const feldQ = $('#q');
  if (feldQ.value !== zustand.q) feldQ.value = zustand.q;
  filtern();
  testZeigen();
  auswahlMarkieren();
  hrefsAktualisieren();
  steckbriefZeigen(fokus);
}

/* ------------------------------------------------------------ Bedienung */
function waehle(id, ausloeser) {
  letzterAusloeser = ausloeser || null;
  zustand.b = id;
  schreibeUrl('push');
  allesZeigen({ fokus: mobil.matches });
}

function bedienungAnbinden() {
  // Klicks auf Kacheln und Chips: eine echte Adresse, ohne Neuladen; Strg/Mittelklick öffnet wie gewohnt
  document.addEventListener('click', e => {
    const a = e.target.closest('a.kachel, a.chip');
    if (a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (zustand.ansicht !== 'karte' && a.closest('#karte')) zustand.ansicht = 'karte';
      waehle(a.dataset.id, a.closest('#blatt') ? letzterAusloeser : a);
      return;
    }
    const v = e.target.closest('[data-ansicht-link]');
    if (v && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      zustand.ansicht = v.dataset.ansichtLink;
      schreibeUrl('push');
      menueZu();
      allesZeigen();
      window.scrollTo(0, 0);
      return;
    }
    if (e.target.closest('[data-auswahl-weg]')) {
      const id = zustand.b;
      zustand.b = null;
      schreibeUrl('push');
      allesZeigen();
      const k = $(`#karte a.kachel[data-id="${CSS.escape(id)}"]`);
      if (k && !k.closest('[hidden]')) k.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-test-schalter]')) {
      zustand.test = !zustand.test;
      schreibeUrl('replace');
      testZeigen();
      hrefsAktualisieren();
      const offen = document.activeElement?.id;
      steckbriefZeigen(false);
      if (offen) document.getElementById(offen)?.focus({ preventScroll: true });
      return;
    }
    const sprung = e.target.closest('[data-sprung]');
    if (sprung) {
      e.preventDefault();
      const ziel = document.getElementById(sprung.dataset.sprung);
      ziel?.scrollIntoView({ block: 'start' });
      return;
    }
    if (e.target.closest('[data-suche-leeren]')) {
      sucheSetzen('');
      $('#q').focus();
    }
  });

  // Suche: tippt live, ersetzt den Verlaufseintrag (kein Eintrag pro Taste)
  const q = $('#q');
  q.addEventListener('input', () => sucheSetzen(q.value));
  q.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); sucheSetzen(''); }
    if ((e.key === 'Enter' || e.key === 'ArrowDown') && zustand.q) {
      // Enter wählt nichts aus, es springt zum ersten Treffer
      const erste = [...document.querySelectorAll('#karte a.kachel')].find(a => !a.closest('[hidden]') && !a.classList.contains('ist-kontext'));
      if (erste) { e.preventDefault(); erste.focus(); }
    }
  });

  // Theme
  $('#theme').addEventListener('click', () => {
    const dunkel = document.documentElement.dataset.theme !== 'dark';
    themeSetzen(dunkel ? 'dark' : 'light');
    try { localStorage.setItem('sapmap-theme', dunkel ? 'dark' : 'light'); } catch { /* privat */ }
  });

  // Ansichtsmenü (schmal)
  $('#ansichten-knopf').addEventListener('click', () => {
    const offen = $('#ansichten').classList.toggle('ist-offen');
    $('#ansichten-knopf').setAttribute('aria-expanded', String(offen));
    if (offen) $('#ansichten a[aria-current="page"]')?.focus();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#ansichten').classList.contains('ist-offen')) { menueZu(); $('#ansichten-knopf').focus(); } });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#ansichten, #ansichten-knopf')) menueZu(); });

  // Dialog (schmal): Schließen nimmt die Auswahl zurück, der Fokus geht zur Kachel
  const blatt = $('#blatt');
  blatt.addEventListener('cancel', e => { e.preventDefault(); blattZu(); });
  $('#blatt-zu').addEventListener('click', blattZu);

  window.addEventListener('popstate', () => { ausUrl(); allesZeigen(); });
  mobil.addEventListener('change', () => steckbriefZeigen(false));
}

function blattZu() {
  const id = zustand.b;
  zustand.b = null;
  schreibeUrl('push');
  allesZeigen();
  const k = (letzterAusloeser && document.contains(letzterAusloeser)) ? letzterAusloeser : $(`#karte a.kachel[data-id="${CSS.escape(id || '')}"]`);
  k?.focus();
}

function menueZu() {
  $('#ansichten').classList.remove('ist-offen');
  $('#ansichten-knopf').setAttribute('aria-expanded', 'false');
}

let sucheTimer = null;
function sucheSetzen(wert) {
  zustand.q = wert;
  if ($('#q').value !== wert) $('#q').value = wert;
  filtern();
  clearTimeout(sucheTimer);
  sucheTimer = setTimeout(() => { schreibeUrl('replace'); hrefsAktualisieren(); }, 250);
}

function themeSetzen(t) {
  document.documentElement.dataset.theme = t;
  const dunkel = t === 'dark';
  $('#theme').setAttribute('aria-checked', String(dunkel));
  $('meta[name="theme-color"]').setAttribute('content', dunkel ? '#0F0B22' : '#FFFFFF');
}

function kopfHoeheMessen() {
  const k = $('.kopf');
  const setzen = () => document.documentElement.style.setProperty('--kopf-h', k.offsetHeight + 'px');
  setzen();
  new ResizeObserver(setzen).observe(k);
}

/* ------------------------------------------------------------ Start */
async function start() {
  themeSetzen(document.documentElement.dataset.theme || 'light');
  $('#stand').textContent = `Recherche-Stand ${STAND}`;
  kopfHoeheMessen();
  bedienungAnbinden();
  try {
    const r = await fetch(DATEN_URL);
    if (!r.ok) throw new Error(r.status);
    vorbereiten(await r.json());
  } catch (err) {
    $('#karte').innerHTML = `<div class="leer"><h2>Daten nicht geladen</h2><p>Die Datei data/steckbriefe.json ließ sich nicht laden. Die Seite muss über einen Webserver aus dem Repo-Wurzelordner laufen.</p></div>`;
    console.warn('Landkarte: Daten nicht geladen', err);
    return;
  }
  ausUrl();
  einstiegFuellen();
  karteBauen();
  history.replaceState({ app: true }, '', urlFuer());
  allesZeigen();
  document.documentElement.dataset.geladen = '1';
}
start();
