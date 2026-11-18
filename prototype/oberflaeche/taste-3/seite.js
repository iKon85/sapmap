// taste-3 "Fristen": die Landschaft entlang der Zeit.
// Eine Matrix zählt die Termine je Bereich und Jahr und filtert die Terminliste; ein Termin klappt den Steckbrief auf.
import {
  BEREICHE, BEREICH, $, $$, esc, K, laden, heuteIso, datumText, istZukunft, istFrist,
  zustand, zustandAnlegen, urlLesen, urlFuer, urlSchreiben, marke, chip, feld,
  sbTitel, sbStatus, sbFelder, sbTest, sbDaten, sbVerwandt, sbBeleg, sbQuellen, testZeigen, anbinden, ansage, ladefehler,
} from './kern.js';

// Spalten der Matrix: die Jahre mit vielen Terminen einzeln, die Ränder gebündelt (die Bündel stehen im Spaltenkopf)
const SPALTEN = [['bis2022', 'bis 2022'], ['2023', '2023'], ['2024', '2024'], ['2025', '2025'], ['2026', '2026'], ['2027', '2027'], ['2028', '2028'], ['2029-30', '2029–30'], ['ab2031', 'ab 2031']];
const SPALTE = Object.fromEntries(SPALTEN);
const spalteVon = j => j <= 2022 ? 'bis2022' : j <= 2028 ? String(j) : j <= 2030 ? '2029-30' : 'ab2031';
const letztesJahr = k => ({ bis2022: 2022, '2029-30': 2030, ab2031: Infinity }[k] ?? Number(k));
const stufe = n => n >= 16 ? 5 : n >= 8 ? 4 : n >= 4 ? 3 : n >= 2 ? 2 : n ? 1 : 0;
const norm = s => String(s || '').toLocaleLowerCase('de');
const mz = (n, ein, mehr) => `${n} ${n === 1 ? ein : mehr}`;
const HEUTE = heuteIso(), JAHR = Number(HEUTE.slice(0, 4));

let EV = [];      // alle Termine: { key, id, d, datum, text, spalte, frist, zukunft, such }
let OHNE = [];    // Steckbriefe ohne Termin
let ZELLEN = {};  // Bereich -> Spalte -> { n, fr }
let MX = { r: 0, c: 4 };   // Feld der Matrix, das den Tastaturfokus trägt

function aufbauen() {
  K.DATA.forEach(d => {
    const daten = d.daten || [];
    if (!daten.length) { OHNE.push(d); return; }
    const kopf = norm([d.name, ...(d.aka || []), BEREICH[d.layer]].join(' \u0001 '));
    daten.forEach((e, i) => {
      const datum = String(e.datum);
      EV.push({ key: d.id + '.' + i, id: d.id, d, datum, text: e.text, spalte: spalteVon(Number(datum.slice(0, 4))),
        frist: istFrist(e.text), zukunft: istZukunft(datum, HEUTE), such: norm(e.text) + ' \u0001 ' + kopf });
    });
  });
  EV.sort((a, b) => a.datum.localeCompare(b.datum) || a.d.name.localeCompare(b.d.name, 'de'));
}

/* ------------------------------------------------------------ Filter */
const woerter = () => norm(zustand.q).trim().split(/\s+/).filter(Boolean);
// Suche und Fristen-Schalter gelten für Matrix und Liste; Bereich, Jahr und "vergangene" nur für die Liste
const passt = (e, W) => (!zustand.f || e.frist) && W.every(w => e.such.includes(w));
const inAuswahl = e => (!zustand.l || e.d.layer === zustand.l) && (!zustand.j || e.spalte === zustand.j);
const filterAktiv = () => Boolean(zustand.q || zustand.l || zustand.j || zustand.f);

/* ------------------------------------------------------------ Matrix */
function matrixZeichnen() {
  const W = woerter();
  ZELLEN = {};
  EV.forEach(e => { if (!passt(e, W)) return; const z = ((ZELLEN[e.d.layer] ||= {})[e.spalte] ||= { n: 0, fr: 0 }); z.n++; if (e.frist) z.fr++; });
  const heuteSpalte = spalteVon(JAHR), wahl = zustand.l || zustand.j;
  const kopf = `<thead><tr><td></td>${SPALTEN.map(([k, name], c) =>
    `<th scope="col"${k === heuteSpalte ? ' class="ist-heute"' : ''}><button type="button" class="mx-kopf" data-spalte="${k}" data-r="-1" data-c="${c}" aria-pressed="${zustand.j === k}" tabindex="-1">${name}${k === heuteSpalte ? '<span class="vh"> (laufendes Jahr)</span>' : ''}</button></th>`).join('')}</tr></thead>`;
  const rumpf = BEREICHE.map(([l, name], r) => `<tr><th scope="row"><button type="button" class="mx-kopf mx-kopf--zeile" data-zeile="${l}" data-r="${r}" data-c="-1" aria-pressed="${zustand.l === l}" tabindex="-1">${esc(name)}</button></th>${
    SPALTEN.map(([k, jahr], c) => {
      const z = ZELLEN[l]?.[k];
      if (!z) return '<td class="mx-leer"><span class="vh">kein Termin</span></td>';
      const drin = (!zustand.l || zustand.l === l) && (!zustand.j || zustand.j === k);
      const text = `${name}, ${jahr}: ${mz(z.n, 'Termin', 'Termine')}${z.fr ? `, davon ${z.fr} mit Wartungsende oder Frist` : ''}`;
      return `<td><button type="button" class="zelle${wahl && !drin ? ' ist-aus' : ''}${z.fr ? ' hat-frist' : ''}" data-stufe="${stufe(z.n)}" data-zeile="${l}" data-spalte="${k}" data-r="${r}" data-c="${c}" aria-pressed="${zustand.l === l && zustand.j === k}" aria-label="${esc(text)}" tabindex="-1">${z.n}</button></td>`;
    }).join('')}</tr>`).join('');
  $('#matrix').innerHTML = kopf + `<tbody>${rumpf}</tbody>`;
  const anker = $(`#matrix [data-r="${MX.r}"][data-c="${MX.c}"]`) || $('#matrix .zelle') || $('#matrix button');
  if (anker) anker.tabIndex = 0;
  lesezeile();
}
function lesezeile(text) {
  if (!text) {
    const teile = [zustand.l && BEREICH[zustand.l], zustand.j && SPALTE[zustand.j]].filter(Boolean);
    text = teile.length ? `Auswahl: ${teile.join(', ')}. Ein zweiter Klick hebt sie auf.` : 'Ein Feld wählt Bereich und Jahr für die Terminliste, ein Kopf nur die Zeile oder die Spalte.';
  }
  $('#lesezeile').textContent = text;
}
function mxNachbar(r, c, dr, dc) {
  for (let i = 0; i < 14; i++) {
    r += dr; c += dc;
    if (r < -1 || r > BEREICHE.length - 1 || c < -1 || c > SPALTEN.length - 1) return null;
    const b = $(`#matrix [data-r="${r}"][data-c="${c}"]`);
    if (b) return b;
  }
  return null;
}

/* ------------------------------------------------------------ Steckbrief, aufgeklappt an Ort und Stelle */
function blatt(d, anker) {
  const gewaehlt = anker && anker.id === d.id ? anker.datum + '|' + anker.text : '';
  const fl = K.FLUSS[d.id] || [];
  return `<article class="blatt" id="blatt" aria-labelledby="sb-name">
    <div class="blatt__kopf"><div class="blatt__titel">${sbTitel(d, { tag: 'h3' })}</div>
      <button class="blatt__zu" type="button" data-blatt-zu aria-label="Steckbrief schließen"><span class="ic ic--zu" aria-hidden="true"></span></button></div>
    <p class="sb__kurz">${esc(d.kurz)}</p>
    ${sbStatus(d)}
    ${sbDaten(d, gewaehlt)}
    ${sbFelder(d)}
    ${sbTest(d)}
    ${feld('Lizenz', d.lizenz)}
    ${fl.length ? `<section class="sb__feld"><h3>Übergaben in der Toolchain</h3><ul class="fluesse">${fl.map(f => {
      const partner = K.byId[f.von === d.id ? f.nach : f.von];
      const weg = f.richtung === 'beidseitig' ? 'im Austausch mit' : f.von === d.id ? 'übergibt an' : 'erhält von';
      return `<li><span>${weg} <a href="${esc(urlFuer({ b: partner.id }))}" data-id="${esc(partner.id)}">${esc(partner.name)}</a></span> <span>${esc(f.was)}</span></li>`;
    }).join('')}</ul></section>` : ''}
    ${sbVerwandt(d)}
    ${sbBeleg(d)}
    ${sbQuellen(d)}
  </article>`;
}

/* ------------------------------------------------------------ Terminliste */
function listeZeichnen() {
  const W = woerter();
  const basis = EV.filter(e => passt(e, W) && inAuswahl(e));
  const zeilen = zustand.v ? basis : basis.filter(e => e.zukunft);
  const frueher = basis.length - zeilen.length;
  const d = zustand.b ? K.byId[zustand.b] : null;
  const anker = d && zeilen.find(e => e.key === zustand.e);

  $('#trefferzahl').textContent = mz(zeilen.length, 'Termin', 'Termine');
  $$('[data-schalter]').forEach(b => { if (b.getAttribute('role') === 'switch') b.setAttribute('aria-checked', String(zustand[b.dataset.schalter])); });
  $('[data-suche-leeren]').hidden = !zustand.q;
  const wahl = [['l', 'Bereich', BEREICH[zustand.l]], ['j', 'Jahr', SPALTE[zustand.j]]].filter(w => w[2]);
  $('#auswahl').hidden = !wahl.length;
  $('#auswahl').innerHTML = wahl.map(([k, art, name]) => `<button class="wahl" type="button" data-wahl-weg="${k}" aria-label="${art} ${esc(name)} abwählen"><span class="wahl__art">${art}</span> ${esc(name)}<span class="ic ic--zu" aria-hidden="true"></span></button>`).join('');

  // ein Steckbrief ohne sichtbare Zeile (Verweis, Adresse von außen) steht über der Liste
  $('#oben').innerHTML = d && !anker && zustand.e !== 'ohne' ? blatt(d, null) : '';

  let html = !zustand.v && frueher ? `<button class="btn btn--secondary frueher" type="button" data-schalter="v"><span class="ic ic--kalender" aria-hidden="true"></span>${mz(frueher, 'früheren Termin', 'frühere Termine')} einblenden</button>` : '';
  if (!zeilen.length) {
    html += `<div class="leer"><h3>Kein Termin für diese Auswahl</h3><p>${!zustand.v && frueher ? 'Vor uns liegt dazu nichts mehr; die früheren Termine lassen sich einblenden.' : 'Suche, Schalter und Matrix schließen zusammen alle Termine aus.'}</p>${filterAktiv() ? '<button class="btn btn--secondary" type="button" data-zuruecksetzen>Filter zurücksetzen</button>' : ''}</div>`;
  }
  let jahr = '', heuteGesetzt = !zustand.v || !zeilen.some(e => !e.zukunft) || !zeilen.some(e => e.zukunft);
  zeilen.forEach((e, i) => {
    const j = e.datum.slice(0, 4);
    if (j !== jahr) {
      if (jahr) html += '</ol>';
      jahr = j;
      const n = zeilen.filter(x => x.datum.startsWith(j)).length;
      html += `<div class="jahr"><h3 id="jahr-${j}">${j}</h3> <span class="jahr__zahl">${mz(n, 'Termin', 'Termine')}</span></div><ol class="termine">`;
    }
    if (!heuteGesetzt && e.zukunft) { heuteGesetzt = true; html += `<li class="heute" id="heute"><span>Heute, ${datumText(HEUTE)}</span></li>`; }
    const offen = Boolean(anker && anker.key === e.key);
    html += `<li class="tz${offen ? ' ist-offen' : ''}"><a class="termin" href="${esc(urlFuer({ b: e.id, e: e.key }))}" data-id="${esc(e.id)}" data-e="${esc(e.key)}" aria-expanded="${offen}">
      <time datetime="${esc(e.datum)}">${datumText(e.datum)}</time>
      <span class="termin__inhalt"><span class="termin__kopf"><span class="termin__name">${esc(e.d.name)}</span>${marke(e.d)}${e.frist ? '<span class="status" data-status="frist">Frist</span>' : ''}</span> <span class="termin__text">${esc(e.text)}</span></span>
      <span class="ic ic--runter termin__pfeil" aria-hidden="true"></span></a>${offen ? blatt(d, e) : ''}</li>`;
    if (i === zeilen.length - 1) html += '</ol>';
  });
  $('#agenda').innerHTML = html;
  return zeilen.length;
}

/* ------------------------------------------------------------ Bausteine ohne Termin */
function ohneZeichnen() {
  const W = woerter();
  const liste = OHNE.filter(d => W.every(w => norm([d.name, ...(d.aka || []), BEREICH[d.layer], d.kurz].join(' \u0001 ')).includes(w)));
  $('#ohne-zahl').textContent = W.length ? `${liste.length} von ${OHNE.length}` : String(OHNE.length);
  $('#ohne-liste').innerHTML = liste.length ? liste.map(d => chip(d.id)).join('') : '<p class="ohne__leer">Kein Baustein ohne Termin passt zur Suche.</p>';
  const d = zustand.b && zustand.e === 'ohne' ? K.byId[zustand.b] : null;
  $('#ohne-blatt').innerHTML = d ? blatt(d, null) : '';
}

function alles() { matrixZeichnen(); const n = listeZeichnen(); ohneZeichnen(); testZeigen(); return n; }

/* ------------------------------------------------------------ Bedienung */
// rückt ein Element unter den Kopf, wenn es darüber oder weit unten liegt
function zeigen(el) {
  if (!el) return;
  const oben = $('.nav').offsetHeight + 12, y = el.getBoundingClientRect().top;
  if (y < oben || y > innerHeight * 0.6) window.scrollBy({ top: y - oben, behavior: 'instant' });
}
function blattFokus() { $('#sb-name')?.focus({ preventScroll: true }); }
function blattSchliessen() {
  const key = zustand.e;
  zustand.b = ''; zustand.e = '';
  urlSchreiben('push');
  listeZeichnen(); ohneZeichnen(); testZeigen();
  ($(`.termin[data-e="${CSS.escape(key)}"]`) || $('#q')).focus({ preventScroll: true });
}
// ein Termin klappt den Steckbrief unter seiner Zeile auf (zweiter Klick: zu); ein Verweis im Steckbrief tauscht ihn an Ort und Stelle
function waehle(id, a) {
  const zeile = a.closest('.termin');
  if (zeile) {
    const key = zeile.dataset.e, vorher = zeile.getBoundingClientRect().top;
    const zu = zustand.b === id && zustand.e === key;
    zustand.b = zu ? '' : id; zustand.e = zu ? '' : key;
    urlSchreiben('push');
    listeZeichnen(); ohneZeichnen(); testZeigen();
    const neu = $(`.termin[data-e="${CSS.escape(key)}"]`);
    if (neu) window.scrollBy({ top: neu.getBoundingClientRect().top - vorher, behavior: 'instant' });   // die Zeile bleibt, wo sie war
    if (zu) neu?.focus({ preventScroll: true }); else { zeigen(neu); blattFokus(); ansage(`Steckbrief ${K.byId[id].name} geöffnet`); }
    return;
  }
  if (a.closest('#ohne-liste')) zustand.e = 'ohne';
  zustand.b = id;
  urlSchreiben('push');
  listeZeichnen(); ohneZeichnen(); testZeigen();
  zeigen($('#blatt')); blattFokus();
  ansage(`Steckbrief ${K.byId[id].name} geöffnet`);
}
function filterGeaendert() {
  zustand.b = ''; zustand.e = '';
  urlSchreiben('replace');
  const n = alles();
  ansage(`${mz(n, 'Termin', 'Termine')} in der Liste`);
}

function bedienung() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-zur-suche]')) { e.preventDefault(); $('#q').scrollIntoView({ block: 'center' }); $('#q').focus({ preventScroll: true }); return; }
    if (t.closest('[data-suche-leeren]')) { zustand.q = ''; $('#q').value = ''; filterGeaendert(); $('#q').focus(); return; }
    if (t.closest('[data-blatt-zu]')) { blattSchliessen(); return; }
    if (t.closest('[data-zuruecksetzen]')) { Object.assign(zustand, { q: '', l: '', j: '', f: false }); $('#q').value = ''; filterGeaendert(); $('#q').focus({ preventScroll: true }); return; }
    const s = t.closest('[data-schalter]');
    if (s) { const k = s.dataset.schalter; zustand[k] = !zustand[k]; filterGeaendert(); if (!s.isConnected) $(`.schalter[data-schalter="${k}"]`).focus({ preventScroll: true }); return; }
    const w = t.closest('[data-wahl-weg]');
    if (w) { zustand[w.dataset.wahlWeg] = ''; filterGeaendert(); ($('#auswahl button') || $('#q')).focus({ preventScroll: true }); return; }
    const m = t.closest('#matrix button');
    if (m) {
      MX = { r: Number(m.dataset.r), c: Number(m.dataset.c) };
      const l = m.dataset.zeile, j = m.dataset.spalte;
      if (l && j) { const zu = zustand.l === l && zustand.j === j; zustand.l = zu ? '' : l; zustand.j = zu ? '' : j; }
      else if (l) zustand.l = zustand.l === l ? '' : l;
      else zustand.j = zustand.j === j ? '' : j;
      if (zustand.j && letztesJahr(zustand.j) < JAHR) zustand.v = true;   // ein vergangenes Jahr zeigt seine Termine ohne Umweg
      filterGeaendert();
      $(`#matrix [data-r="${MX.r}"][data-c="${MX.c}"]`)?.focus({ preventScroll: true });
      // gestapelt (schmaler als zwei Spalten) liegt die Liste unter der Matrix: dorthin gehen
      if ((zustand.l || zustand.j) && !matchMedia('(min-width: 1280px)').matches) $('#termine').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });
  anbinden({ waehle });

  $('#q').addEventListener('input', e => { zustand.q = e.target.value; filterGeaendert(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && zustand.b && !e.defaultPrevented) { blattSchliessen(); return; }
    const b = e.target.closest?.('#matrix button');
    const weg = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (!b || !weg) return;
    const n = mxNachbar(Number(b.dataset.r), Number(b.dataset.c), ...weg);
    e.preventDefault();
    if (!n) return;
    b.tabIndex = -1; n.tabIndex = 0; n.focus();
    MX = { r: Number(n.dataset.r), c: Number(n.dataset.c) };
  });
  // das Feld unter Zeiger oder Fokus nennt Bereich, Jahr und Zahl in der Lesezeile
  const mx = $('#matrix');
  const lesen = e => { const b = e.target.closest('.zelle'); lesezeile(b ? b.getAttribute('aria-label') : ''); };
  mx.addEventListener('pointerover', lesen);
  mx.addEventListener('focusin', lesen);
  mx.addEventListener('pointerleave', () => lesezeile());
  mx.addEventListener('focusout', () => lesezeile());

  window.addEventListener('popstate', () => { urlLesen(); pruefen(); $('#q').value = zustand.q; alles(); });
}
function pruefen() {
  if (!BEREICH[zustand.l]) zustand.l = '';
  if (!SPALTE[zustand.j]) zustand.j = '';
  if (!zustand.b) zustand.e = '';
}

async function start() {
  zustandAnlegen({ l: '', j: '', f: false, v: false, e: '' });
  bedienung();
  try { await laden(); } catch (err) { ladefehler($('#agenda'), err); return; }
  aufbauen();
  urlLesen(); pruefen();
  $('#q').value = zustand.q;
  $('#lead-termine').textContent = EV.length;
  $('#lead-bausteine').textContent = K.DATA.length - OHNE.length;
  $('#lead-alle').textContent = K.DATA.length;
  $('#lead-kommend').textContent = EV.filter(e => e.zukunft).length;
  history.replaceState({ app: true }, '', urlFuer());
  alles();
  // schmal läuft die Matrix im eigenen Scroll-Container: mit dem laufenden Jahr beginnen, nicht mit der Vergangenheit
  const rollen = $('.matrix-rollen'), heuteKopf = $('#matrix th.ist-heute');
  if (heuteKopf && rollen.scrollWidth > rollen.clientWidth) rollen.scrollLeft = heuteKopf.offsetLeft - $('#matrix thead td').offsetWidth - 4;
  if (zustand.b) zeigen($('#blatt'));
  document.documentElement.dataset.geladen = '1';
}
start();
