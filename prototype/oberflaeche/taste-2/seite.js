/* taste-2 "Netz": die Landschaft über ihre Verweise. Ein Baustein steht in der Mitte, links wer auf ihn verweist,
   rechts worauf er verweist. Ein Klick auf einen Nachbarn rückt diesen in die Mitte; der Pfad merkt sich den Weg. */
import {
  K, BEREICHE, BEREICH, $, $$, esc, laden, treffer, rang, zustand, zustandAnlegen, urlLesen, urlFuer, urlSchreiben,
  marke, feld, sbTitel, sbStatus, sbFelder, sbTest, sbDaten, sbBeleg, sbQuellen, testZeigen, anbinden, linksAktualisieren, ansage, ladefehler,
} from './kern.js';

zustandAnlegen({});
const TITEL = 'S/4HANA-Landkarte als Netz: SAP-Bausteine und ihre Verbindungen';
const PFAD_SCHLUESSEL = 'landkarte-netz-pfad';
const PFAD_LAENGE = 6;
let pfad = [];
let startScroll = 0;
const grad = id => K.REL[id].size;

/* ------------------------------------------------------------ Einstieg: Knotenpunkte und Verzeichnis */
function startBauen() {
  $('#lead-zahl').textContent = K.DATA.length;
  $('#lead-verweise').textContent = K.DATA.reduce((n, d) => n + K.AUS[d.id].length, 0);

  const top = [...K.DATA].sort((a, b) => grad(b.id) - grad(a.id) || a.name.localeCompare(b.name, 'de')).slice(0, 12);
  const max = grad(top[0].id);
  $('#knoten-liste').innerHTML = top.map(d => {
    const aus = K.AUS[d.id].length, ein = K.EIN[d.id].length;
    const satz = `${aus + ein} Verbindungen: ${aus} eigene Verweise, ${ein} Rückverweise`;
    return `<li><a class="knoten" href="${esc(urlFuer({ b: d.id }))}" data-id="${esc(d.id)}" title="${esc(satz)}">
      <span class="knoten__name">${esc(d.name)}</span>
      <span class="knoten__bereich">${esc(BEREICH[d.layer])}</span>
      <span class="knoten__balken" aria-hidden="true"><i class="farbe--aus" style="width:${(aus / max * 100).toFixed(2)}%"></i><i class="farbe--ein" style="width:${(ein / max * 100).toFixed(2)}%"></i></span>
      <span class="knoten__zahl">${aus + ein}<span class="vh"> Verbindungen, davon ${aus} eigene Verweise und ${ein} Rückverweise</span></span>
    </a></li>`;
  }).join('');

  $('#verzeichnis-feld').innerHTML = BEREICHE.map(([key, name]) => {
    const liste = K.DATA.filter(d => d.layer === key);
    if (!liste.length) return '';
    return `<section class="vz" aria-labelledby="vz-${key}"><h3 id="vz-${key}">${esc(name)} <span class="vz__zahl">${liste.length}</span></h3><ul>${liste.map(d =>
      `<li><a class="vz__link" href="${esc(urlFuer({ b: d.id }))}" data-id="${esc(d.id)}"><span class="vz__name">${esc(d.name)}</span> ${marke(d)} <span class="vz__grad" title="${grad(d.id)} Verbindungen">${grad(d.id)}</span></a></li>`).join('')}</ul></section>`;
  }).join('');
}

/* ------------------------------------------------------------ Nachbarschaft eines Bausteins */
// je Partner eine Karte: rechts, worauf dieser Baustein verweist; links, wer auf ihn verweist
function nachbarn(id) {
  const d = K.byId[id];
  const rechts = new Map(), links = new Map();
  const eintrag = (m, pid) => { if (!m.has(pid)) m.set(pid, { id: pid, arten: [], fluss: [] }); return m.get(pid); };
  if (d.parent && K.byId[d.parent]) eintrag(rechts, d.parent).arten.push('Dach des Portfolios');
  K.AUS[id].forEach(x => eintrag(rechts, x).arten.push(K.AUS[x].includes(id) ? 'gegenseitig verwandt' : 'verwandt'));
  (K.KINDER[id] || []).forEach(x => eintrag(rechts.has(x) ? rechts : links, x).arten.push('Produkt im Portfolio'));
  K.EIN[id].forEach(x => eintrag(links, x).arten.push('nennt diesen Baustein'));
  K.FLUSS[id].forEach(f => {
    const partner = f.von === id ? f.nach : f.von;
    if (partner === id) return;
    const seite = rechts.has(partner) ? rechts : links.has(partner) ? links : (f.von === id ? rechts : links);
    eintrag(seite, partner).fluss.push(f);
  });
  return { links: [...links.values()], rechts: [...rechts.values()] };
}
function flussSatz(f, id) {
  const art = f.richtung === 'beidseitig' ? 'Austausch in beide Richtungen' : (f.von === id ? 'Geht dorthin' : 'Kommt von dort');
  return `${art}: ${f.was}`;
}
function karte(e, seite, id) {
  const p = K.byId[e.id];
  const fluss = e.fluss.map(f => { const s = flussSatz(f, id); return `<span class="karte__fluss" title="${esc(s)}"><span class="ic ic--fluss" aria-hidden="true"></span><span>${esc(s)}</span></span>`; }).join('');
  const arten = e.arten.length ? e.arten.join(', ') : 'Datenfluss in der Toolchain';
  return `<li><a class="karte" href="${esc(urlFuer({ b: e.id }))}" data-id="${esc(e.id)}" data-seite="${seite}">
    <span class="karte__kopf"><span class="karte__name">${esc(p.name)}</span>${marke(p)}</span>
    <span class="karte__meta">${esc(BEREICH[p.layer])} · ${esc(arten)}</span>${fluss}</a></li>`;
}
function seiteHtml(liste, seite, titel, leer, id) {
  return `<div class="netz__seite netz__seite--${seite}"><h2>${titel} <span class="netz__zahl">${liste.length}</span></h2>${
    liste.length ? `<ul class="karten">${liste.map(e => karte(e, seite, id)).join('')}</ul>` : `<p class="netz__leer">${leer}</p>`}</div>`;
}
function fluesseHtml(d) {
  const fl = K.FLUSS[d.id];
  if (!fl.length) return '';
  return `<section class="sb__feld"><h3>Datenflüsse in der Toolchain</h3><ul class="fluesse">${fl.map(f =>
    `<li><strong>${esc(K.byId[f.von].name)} ${f.richtung === 'beidseitig' ? '↔' : '→'} ${esc(K.byId[f.nach].name)}</strong><span>${esc(f.was)}</span>${
      f.quelle ? `<a href="${esc(f.quelle)}" target="_blank" rel="noopener">Quelle des Datenflusses</a>` : ''}</li>`).join('')}</ul></section>`;
}
function fokusHtml(d) {
  const n = nachbarn(d.id);
  return `<section class="netz" aria-labelledby="sb-name">
      <svg class="netz__linien" aria-hidden="true" focusable="false"></svg>
      <article class="knotenkarte" id="knotenkarte">
        ${sbTitel(d, { tag: 'h1' })}
        <p class="sb__kurz">${esc(d.kurz)}</p>
        ${sbStatus(d)}
        <a class="knotenkarte__weiter" href="#steckbrief" data-zum-steckbrief>Steckbrief lesen<span class="ic ic--runter" aria-hidden="true"></span></a>
      </article>
      ${seiteHtml(n.links, 'links', 'Verweist hierher', 'Kein anderer Baustein verweist auf diesen.', d.id)}
      ${seiteHtml(n.rechts, 'rechts', 'Verweist auf', 'Dieser Baustein verweist auf keinen anderen.', d.id)}
    </section>
    <section class="blatt" id="steckbrief" aria-labelledby="steckbrief-h" tabindex="-1">
      <h2 id="steckbrief-h">Steckbrief: ${esc(d.name)}</h2>
      <div class="blatt__raster">
        <div class="blatt__text">${sbFelder(d)}${sbTest(d)}${feld('Lizenz', d.lizenz)}${fluesseHtml(d)}${sbBeleg(d)}${sbQuellen(d)}</div>
        <aside class="blatt__rand" aria-label="Termine">${sbDaten(d) || '<section class="sb__feld"><h3>Daten</h3><p>Für diesen Baustein sind keine Termine erfasst.</p></section>'}</aside>
      </div>
    </section>`;
}

/* ------------------------------------------------------------ Verbindungslinien: vom Knoten zu jeder Karte */
let zeichnenGeplant = false;
function linienZeichnen() {
  zeichnenGeplant = false;
  const netz = $('.netz');
  if (!netz) return;
  const svg = $('.netz__linien', netz), knoten = $('#knotenkarte');
  if (getComputedStyle(svg).display === 'none') { svg.innerHTML = ''; return; }
  const r0 = netz.getBoundingClientRect(), k = knoten.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
  svg.setAttribute('width', r0.width); svg.setAttribute('height', r0.height);
  const ky = k.top - r0.top + Math.min(k.height / 2, 96);
  const an = svg.dataset.an || '';
  svg.innerHTML = $$('.karte', netz).map(a => {
    const r = a.getBoundingClientRect(), links = a.dataset.seite === 'links';
    const x1 = (links ? r.right : r.left) - r0.left, y1 = r.top - r0.top + r.height / 2;
    const x2 = (links ? k.left : k.right) - r0.left, mx = (x1 + x2) / 2;
    return `<path data-fuer="${esc(a.dataset.id)}"${a.dataset.id === an ? ' class="ist-an"' : ''} d="M${x1.toFixed(1)},${y1.toFixed(1)} C${mx.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${ky.toFixed(1)} ${x2.toFixed(1)},${ky.toFixed(1)}"/>`;
  }).join('');
}
function linienPlanen() { if (!zeichnenGeplant && zustand.b) { zeichnenGeplant = true; requestAnimationFrame(linienZeichnen); } }
function linieAn(id) {
  const svg = $('.netz__linien');
  if (!svg) return;
  svg.dataset.an = id;
  $$('path', svg).forEach(p => p.classList.toggle('ist-an', !!id && p.dataset.fuer === id));
}

/* ------------------------------------------------------------ Pfad: der Weg durch das Netz in dieser Sitzung */
function pfadLesen() { try { pfad = JSON.parse(sessionStorage.getItem(PFAD_SCHLUESSEL) || '[]').filter(id => K.byId[id]); } catch { pfad = []; } }
function pfadMerken(id) {
  const i = pfad.indexOf(id);
  pfad = i >= 0 ? pfad.slice(0, i + 1) : [...pfad, id].slice(-PFAD_LAENGE);
  try { sessionStorage.setItem(PFAD_SCHLUESSEL, JSON.stringify(pfad)); } catch { /* ohne Speicher gilt der Pfad bis zum Neuladen */ }
}
function pfadZeigen() {
  $('#pfad').innerHTML = pfad.map((id, i) => i === pfad.length - 1
    ? `<li aria-current="page">${esc(K.byId[id].name)}</li>`
    : `<li><a href="${esc(urlFuer({ b: id }))}" data-id="${esc(id)}">${esc(K.byId[id].name)}</a><span class="ic ic--rechts" aria-hidden="true"></span></li>`).join('');
}

/* ------------------------------------------------------------ Suche: Combobox mit Trefferliste */
let liste = [], auswahl = -1;
function sucheZu() { const ul = $('#q-liste'); ul.hidden = true; $('#q').setAttribute('aria-expanded', 'false'); $('#q').removeAttribute('aria-activedescendant'); }
function auswahlZeigen() {
  $$('#q-liste [role="option"]').forEach((li, i) => li.setAttribute('aria-selected', String(i === auswahl)));
  if (auswahl >= 0) { $('#q').setAttribute('aria-activedescendant', `q-o${auswahl}`); $(`#q-o${auswahl}`)?.scrollIntoView({ block: 'nearest' }); }
}
function sucheZeigen() {
  const q = $('#q').value, t = treffer(q), ul = $('#q-liste');
  $('[data-suche-leeren]').hidden = !q;
  if (!t) { liste = []; auswahl = -1; sucheZu(); $('#trefferzahl').textContent = ''; return; }
  liste = K.DATA.filter(d => t.has(d.id)).sort((a, b) => rang(a, q) - rang(b, q) || grad(b.id) - grad(a.id) || a.name.localeCompare(b.name, 'de')).slice(0, 8);
  auswahl = liste.length ? 0 : -1;
  ul.innerHTML = liste.length
    ? liste.map((d, i) => `<li class="menue__eintrag" role="option" id="q-o${i}" aria-selected="false" data-wahl="${esc(d.id)}"><span>${esc(d.name)}</span><small>${esc(BEREICH[d.layer])}</small></li>`).join('')
    : `<li class="menue__leer">Kein Baustein passt zu „${esc(q)}“. Kürzel wie „PI/PO“ oder ein Produktname führen meist zum Ziel.</li>`;
  ul.hidden = false;
  $('#q').setAttribute('aria-expanded', 'true');
  auswahlZeigen();
  $('#trefferzahl').textContent = t.size === 0 ? 'Kein Treffer' : `${t.size} Treffer${t.size > liste.length ? `, die ersten ${liste.length} stehen in der Liste` : ''}`;
}
function sucheLeeren() { $('#q').value = ''; sucheZeigen(); }

/* ------------------------------------------------------------ Ansichten */
function allesZeigen({ fokus = false } = {}) {
  const d = zustand.b ? K.byId[zustand.b] : null;
  $('#v-start').hidden = !!d;
  $('#v-fokus').hidden = !d;
  (d ? $('#fokus-suche') : $('#start-suche')).append($('#werkzeug'));   // ein Suchfeld, es wandert mit der Ansicht
  if (d) {
    pfadMerken(d.id);
    pfadZeigen();
    $('#fokus').innerHTML = fokusHtml(d);
    linienZeichnen();
    if (fokus) { window.scrollTo(0, 0); $('#sb-name').focus({ preventScroll: true }); }
    ansage(`${d.name} steht in der Mitte: ${K.EIN[d.id].length} Bausteine verweisen hierher, ${K.AUS[d.id].length} Verweise nach außen.`);
  } else {
    $('#fokus').innerHTML = '';
    ansage('');
  }
  testZeigen();
  linksAktualisieren();
  $$('[data-zum-start]').forEach(a => { if (!a.dataset.zumStart) a.href = urlFuer({ b: '' }); });
  document.title = (d ? `${d.name} · ` : '') + TITEL;
}
function waehle(id) {
  if (!zustand.b) startScroll = window.scrollY;
  sucheLeeren();
  zustand.b = id;
  urlSchreiben('push');
  allesZeigen({ fokus: true });
}
function zumStart(anker) {
  if (zustand.b) { zustand.b = ''; urlSchreiben('push'); allesZeigen(); window.scrollTo(0, anker ? 0 : startScroll); }
  if (anker) $('#' + anker)?.scrollIntoView({ block: 'start' });
}

function bedienung() {
  document.addEventListener('click', e => {
    const zs = e.target.closest('[data-zum-start]');
    if (zs && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); zumStart(zs.dataset.zumStart || ''); if (zs.classList.contains('nav__logo')) window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-zur-suche]')) { e.preventDefault(); $('#q').scrollIntoView({ block: 'center' }); $('#q').focus({ preventScroll: true }); return; }
    if (e.target.closest('[data-suche-leeren]')) { sucheLeeren(); $('#q').focus(); return; }
    if (e.target.closest('[data-zum-steckbrief]')) { e.preventDefault(); const s = $('#steckbrief'); s.scrollIntoView({ block: 'start' }); s.focus({ preventScroll: true }); }
  }, true);
  anbinden({ waehle });

  const q = $('#q'), ul = $('#q-liste');
  q.addEventListener('input', sucheZeigen);
  q.addEventListener('focus', () => { if (q.value) sucheZeigen(); });
  q.addEventListener('blur', () => setTimeout(sucheZu, 120));
  q.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!ul.hidden) { e.preventDefault(); sucheZu(); } else if (q.value) { e.preventDefault(); sucheLeeren(); } return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!liste.length) return;
      e.preventDefault();
      if (ul.hidden) { sucheZeigen(); return; }
      auswahl = (auswahl + (e.key === 'ArrowDown' ? 1 : -1) + liste.length) % liste.length;
      auswahlZeigen();
    }
    if (e.key === 'Enter' && auswahl >= 0 && liste[auswahl]) { e.preventDefault(); waehle(liste[auswahl].id); }
  });
  ul.addEventListener('pointerdown', e => { const li = e.target.closest('[data-wahl]'); if (li) { e.preventDefault(); waehle(li.dataset.wahl); } });
  ul.addEventListener('pointermove', e => { const li = e.target.closest('[data-wahl]'); if (!li) return; const i = Number(li.id.slice(3)); if (i !== auswahl) { auswahl = i; auswahlZeigen(); } });

  // die Linie zur Karte unter Zeiger oder Fokus tritt hervor
  const fokusEl = $('#fokus');
  fokusEl.addEventListener('pointerover', e => { const a = e.target.closest('a.karte'); linieAn(a ? a.dataset.id : ''); });
  fokusEl.addEventListener('focusin', e => { const a = e.target.closest('a.karte'); linieAn(a ? a.dataset.id : ''); });
  fokusEl.addEventListener('pointerleave', () => linieAn(''));

  // der Knoten klebt beim Scrollen oben, die Linien folgen ihm
  window.addEventListener('scroll', linienPlanen, { passive: true });
  window.addEventListener('resize', linienPlanen);
  window.addEventListener('popstate', () => { const war = zustand.b; urlLesen(); allesZeigen(); if (war && !zustand.b) window.scrollTo(0, startScroll); else if (zustand.b) window.scrollTo(0, 0); });
}

async function start() {
  bedienung();
  try { await laden(); } catch (err) { ladefehler($('#verzeichnis-feld'), err); return; }
  urlLesen();
  pfadLesen();
  startBauen();
  history.replaceState({ app: true }, '', urlFuer());
  allesZeigen();
  document.fonts?.ready.then(linienPlanen);
  document.documentElement.dataset.geladen = '1';
}
start();
