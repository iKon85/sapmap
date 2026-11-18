// taste-1 "Schnitt": die Landschaft als Architekturschnitt. Zeigen liest eine Zeile, Klick öffnet das Blatt.
// Zustand in der URL: ?b (Baustein), ?q (Suche), ?s (Status hervorheben), ?test.
import { K, $, $$, esc, laden, treffer, BEREICH, STATUS, zustand, zustandAnlegen, urlLesen, urlFuer, urlSchreiben,
  statusTag, chip, feld, sbTitel, sbStatus, sbFelder, sbTest, sbDaten, sbVerwandt, sbBeleg, sbQuellen,
  testZeigen, anbinden, linksAktualisieren, ansage, ladefehler, BELEGT } from './kern.js';

// Kurzbezeichnungen für die Zellen: aus dem Schichtenmodell der alten Seite (src/landkarte.html, renderStack),
// für Portfolio-Produkte und Dächer aus dem Namen gekürzt. Der volle Name steht in der Lesezeile und im Blatt.
const KURZ = {"fiori":"Fiori Launchpad","work-zone":"Build Work Zone","joule":"Joule","joule-work":"Joule Work","sac":"SAP Analytics Cloud","businessobjects":"BusinessObjects","successfactors":"SuccessFactors","ecp":"EC Payroll","ariba":"Ariba","concur":"Concur","fieldglass":"Fieldglass","sales-service-cloud":"Sales & Service Cloud","commerce-emarsys":"Commerce, Emarsys, CPQ","fsm":"Field Service Mgmt","ibp":"IBP","dmc":"Digital Manufacturing","apm":"Asset Performance Mgmt","taulia-cashapp":"Taulia, Cash App","drc":"E-Rechnung (DRC)","sustainability":"Green Ledger, SFM","prm":"Project & Resource Mgmt","cloud-for-energy":"Cloud for Energy","der":"Distributed Energy Res.","maco-cloud":"MaCo Cloud (MaKo)","business-network":"Business Network","bn-logistics":"BN for Logistics","build-code":"Build Code","cap":"CAP","build-pa":"Build Process Automation","task-center":"Task Center","build-apps":"Build Apps","joule-studio":"Joule Studio","autonomous-suite":"Joule Agents","ai-agent-hub":"AI Agent Hub","joule-dev":"Joule for Developers","rpt-1":"SAP-RPT-1","cf-runtime":"Cloud Foundry","kyma":"Kyma","abap-env":"ABAP Environment","ai-core":"AI Core, Gen AI Hub","hana-cloud":"HANA Cloud","ctms":"Transport Mgmt, CI/CD","neo":"Neo","datasphere":"Datasphere","bw":"BW PCE, BW/4HANA","sap-databricks":"SAP Databricks","bdc-connect":"BDC Connect","dremio":"Dremio (Lakehouse)","eda-at":"EDA Österreich","redispatch":"Redispatch 2.0","cloud-integration":"Cloud Integration","api-mgmt":"API Management","integration-advisor-tpm":"Integration Advisor, TPM","open-connectors":"Open Connectors","sap-graph":"Graph","event-mesh":"Event Mesh","aem":"Advanced Event Mesh","event-hub":"Cloud Application Event Hub","mdi":"Master Data Integration","eic":"Edge Integration Cell","integration-assessment":"Integration Assessment (ISA-M)","migration-assessment":"PI/PO-Migration Assessment","accelerator-hub":"Business Accelerator Hub","slt":"SLT (Replikation)","data-services":"Data Services","data-intelligence":"Data Intelligence","pipo":"PI/PO","s4-private":"Cloud ERP Private","s4-cloud-erp":"Cloud ERP (Public)","s4-onprem":"S/4HANA On-Premise","rise-grow":"RISE, GROW","business-suite":"Business Suite","s4-apis":"Released APIs (OData, SOAP, IDoc, RFC)","s4-business-events":"Business Events","embedded-analytics":"Embedded Analytics","key-user-ext":"Key-User-Erweiterungen","abap-cloud":"ABAP Cloud, RAP","atc":"ABAP Test Cockpit","business-partner":"Business Partner, CVI","central-finance":"Central Finance","group-reporting":"Group Reporting","ewm":"EWM","tm":"TM","ppds-aatp":"PP/DS, aATP","mdg":"MDG","gts":"GTS","is-u":"S/4HANA Utilities","ide-ape":"IDE, APE","h4s4":"HCM for S/4HANA","eppm":"PS, PPM, Invest. Mgmt","cpm":"Commercial Project Mgmt","public-projects":"Enterprise Projects","hana-db":"SAP HANA","rise-ecs":"RISE-Betrieb (ECS)","sovereign-cloud":"Sovereign Cloud","focused-run":"Focused Run","cloud-alm-ops":"Cloud ALM for Operations","lama":"Landscape Mgmt (LaMa)","cloud-identity":"Cloud Identity Services","iag":"Identity Access Gov.","grc":"SAP GRC","etd":"Threat Detection","uidp":"UI Data Protection","data-privacy":"ILM, Data Privacy","idm":"Identity Mgmt (IdM)","activate":"SAP Activate","calm-pm":"Cloud ALM Projekte","joule-consultants":"Joule for Consultants","jira-ado":"Jira / Azure DevOps","agent-led-toolchain":"Agent-led Toolchain","signavio":"SAP Signavio","process-navigator":"Process Navigator","leanix":"SAP LeanIX","cloud-alm":"SAP Cloud ALM","calm-test":"Cloud ALM Test Mgmt","calm-test-automation":"Cloud ALM Testautom.","calm-test-api":"Test-Schnittstelle","tricentis-ect":"Tricentis ECT","tricentis-cia":"Tricentis LiveCompare","tricentis-perf-data":"Tricentis Perf./Daten","walkme":"WalkMe, Enable Now","readiness-check":"Readiness Check","maintenance-planner":"Maintenance Planner","migration-cockpit":"Migration Cockpit","syniti-admm":"Syniti ADMM","sum-dmo":"SUM / DMO","custom-code-migration":"Custom Code Migration","btc":"Transformation Center","sdt":"Selektive Datenübern.","dmlt":"DMLT","snp-kyano":"SNP Kyano","tdms":"Testdaten (TDMS)","transition-option":"ERP Transition Option","solman":"Solution Manager",
  "clean-core":"Clean Core","cloud-connector":"Cloud Connector","btp":"SAP BTP · Business AI Platform","integration-suite":"SAP Integration Suite","bdc":"SAP Business Data Cloud",
  "signavio-pm":"Process Manager","signavio-pi":"Process Intelligence","signavio-pins":"Process Insights","signavio-hub":"Collaboration Hub","signavio-governance":"Process Governance","signavio-ptm":"Transformation Manager",
  "leanix-apm":"Application Portfolio Mgmt","leanix-arp":"Architecture & Road Map","leanix-trc":"Technology Risk & Compliance",
  "tricentis-perf-data-ept":"Performance Testing","tricentis-perf-data-dit":"Data Integrity Testing",
  "walkme-dap":"Digital Adoption Platform","walkme-learning-arc":"Learning Arc","walkme-haiku":"Haiku","walkme-enable-now":"SAP Enable Now"};
const kurz = id => KURZ[id] || K.byId[id].name;
const DACH = ['btp', 'bdc', 'integration-suite']; // Dächer ohne parent-Verweise in den Daten: als Dach gezeichnet, weil ihr Band ihre Teile zeigt

zustandAnlegen({ s: '' });
let PLAN = [], ORT = {}, ZELLEN = {};
let schnittScroll = 0, letzte = '';

/* ------------------------------------------------------------ der Plan: jedes Band, jede Gruppe, jeder Baustein einmal */
function planBauen() {
  const lay = l => K.DATA.filter(d => d.layer === l).map(d => d.id);
  const ohne = (liste, weg) => liste.filter(id => !weg.includes(id));
  PLAN = [
    { id: 'sec', ort: 'links', titel: 'Security & Identity', ids: lay('sec') },
    { id: 'kanal', ort: 'mitte', titel: 'Anwender & Kanäle', ids: ['fiori', 'work-zone', 'task-center', 'joule', 'joule-work', 'sac', 'businessobjects'] },
    { id: 'lob', ort: 'mitte', titel: 'Fachanwendungen in der Cloud', ids: lay('lob') },
    { id: 'btp', ort: 'mitte', titel: 'Plattform & Business AI', ids: ['btp'], gruppen: [
      { titel: 'Eigene Apps & Prozesse', ids: ['build-code', 'cap', 'build-pa', 'build-apps'] },
      { titel: 'KI & Agenten', ids: ['autonomous-suite', 'joule-studio', 'ai-agent-hub', 'joule-dev', 'rpt-1', 'ai-core'] },
      { titel: 'Laufzeiten & Dienste', ids: ['cf-runtime', 'kyma', 'abap-env', 'hana-cloud', 'ctms', 'neo'] }] },
    { id: 'data', ort: 'mitte', titel: 'Daten & Analytics', ids: ['bdc', 'datasphere', 'bw', 'sap-databricks', 'bdc-connect', 'dremio'] },
    { id: 'int', ort: 'mitte', titel: 'Integration & Events', ids: ['integration-suite', ...ohne(lay('int'), ['integration-suite', 's4-apis', 's4-business-events'])] },
    { id: 'grenze', ort: 'mitte', art: 'grenze', titel: 'Clean-Core-Grenze', ids: ['clean-core', 'cloud-connector'] },
    { id: 's4', ort: 'mitte', art: 'kern', titel: 'S/4HANA-Kern', ids: ['s4-cloud-erp', 's4-private', 's4-onprem', 'business-suite', 'rise-grow'], gruppen: [
      { titel: 'Schnittstellen nach außen', ids: ['s4-apis', 's4-business-events', 'embedded-analytics'] },
      { titel: 'Erweiterungen im System', ids: ['key-user-ext', 'abap-cloud', 'atc'] },
      { titel: 'Anwendungskern', ids: ['ewm', 'tm', 'ppds-aatp', 'group-reporting', 'central-finance', 'mdg', 'gts', 'business-partner', 'is-u', 'h4s4', 'ide-ape', 'eppm', 'cpm', 'public-projects'] }] },
    { id: 'db', ort: 'mitte', titel: 'Datenbank', ids: ['hana-db'] },
    { id: 'ops', ort: 'mitte', titel: 'Infrastruktur & Betrieb', ids: [...lay('ops'), 'cloud-alm-ops'] },
    { id: 'projekt', ort: 'rechts', titel: 'Projekt & Lebenszyklus', gruppen: [
      { titel: 'Einführung steuern', ids: ['activate', 'calm-pm', 'joule-consultants', 'jira-ado', 'agent-led-toolchain', 'signavio', 'process-navigator', 'leanix'] },
      { titel: 'Bauen & testen', ids: ['cloud-alm', 'calm-test', 'calm-test-automation', 'calm-test-api', 'tricentis-ect', 'tricentis-cia', 'tricentis-perf-data', 'walkme'] },
      { titel: 'Überführen', ids: lay('mig') },
      { titel: 'Wird abgelöst', ids: ['solman'] }] },
  ];
  // Bausteine, die der Plan nicht kennt (neue Daten), landen nach ihrem Bereich in einer passenden Gruppe
  const RESTE = { core: ['s4', 2], ext: ['s4', 1], btp: ['btp', 2], ai: ['btp', 1], int: ['int'], data: ['data'], lob: ['lob'], tool: ['projekt', 1], mig: ['projekt', 2], pm: ['projekt', 0], sec: ['sec'], ops: ['ops'] };
  // jedes Band bekommt eine namenlose Kopfgruppe (b.ids) vor seinen benannten Gruppen
  PLAN.forEach(b => { b.ids ||= []; b.gruppen ||= []; b.alle = [{ titel: '', ids: b.ids }, ...b.gruppen]; });
  const platziert = new Set();
  PLAN.forEach(b => b.alle.forEach(g => {
    const behalten = g.ids.filter(id => K.byId[id] && !platziert.has(id));
    g.ids.length = 0; g.ids.push(...behalten);
    behalten.forEach(id => platziert.add(id));
  }));
  K.DATA.forEach(d => {
    if (platziert.has(d.id) || (d.parent && K.byId[d.parent])) return;
    const [bid, gi] = RESTE[d.layer] || ['lob'];
    const b = PLAN.find(x => x.id === bid);
    (gi === undefined ? b.ids : b.gruppen[gi].ids).push(d.id);
    platziert.add(d.id);
  });
  ORT = {};
  PLAN.forEach(b => {
    b.alle.forEach(g => {
      const alle = g.ids.flatMap(id => [id, ...(K.KINDER[id] || [])]);
      alle.forEach(id => { ORT[id] = { band: b, gruppe: g.titel ? g : null, nachbarn: alle }; });
    });
  });
}

/* ------------------------------------------------------------ der Schnitt */
function zelle(id, art = '') {
  const d = K.byId[id];
  const st = d.status !== 'aktiv' ? `, ${STATUS[d.status]}` : '';
  return `<a class="zelle${art ? ' zelle--' + art : ''}" href="${esc(urlFuer({ b: id }))}" data-id="${esc(id)}" data-status="${esc(d.status)}" aria-label="${esc(d.name + st)}">${esc(kurz(id))}</a>`;
}
function zellen(ids) {
  return `<div class="zellen">${ids.map(id => {
    const kinder = K.KINDER[id] || [];
    return zelle(id, kinder.length || DACH.includes(id) ? 'dach' : '') + (kinder.length ? `<div class="kinder" role="group" aria-label="Produkte von ${esc(K.byId[id].name)}">${kinder.map(k => zelle(k, 'kind')).join('')}</div>` : '');
  }).join('')}</div>`;
}
function band(b) {
  const zahl = b.alle.flatMap(g => g.ids).flatMap(id => [id, ...(K.KINDER[id] || [])]).length;
  const titel = `<h3 id="band-${b.id}-h">${esc(b.titel)}</h3>`;
  return `<section class="band band--${b.art || 'normal'} band--${b.ort}" id="band-${b.id}" data-band="${b.id}" aria-labelledby="band-${b.id}-h">
    <div class="band__kopf">${titel}<span class="band__zahl" aria-label="${zahl} Bausteine">${zahl}</span></div>
    ${b.ids.length ? zellen(b.ids) : ''}
    ${b.gruppen.map(g => g.ids.length ? `<div class="gruppe"><h4>${esc(g.titel)}</h4>${zellen(g.ids)}</div>` : '').join('')}
  </section>`;
}
function schnittBauen() {
  const von = ort => PLAN.filter(b => b.ort === ort).map(band).join('');
  $('#schnitt-feld').innerHTML = von('links') + `<div class="schnitt__mitte">${von('mitte')}</div>` + von('rechts');
  // Reihenfolge wie im gestapelten Schnitt: Security steht dort hinter dem Betrieb
  $('#sprung').innerHTML = [...PLAN.filter(b => b.id !== 'sec' && b.id !== 'projekt'), ...PLAN.filter(b => b.id === 'sec' || b.id === 'projekt')].filter(b => b.art !== 'grenze').map(b => `<a href="#band-${b.id}">${esc(b.titel)}</a>`).join('');
  ZELLEN = {};
  $$('#schnitt-feld a.zelle').forEach(a => (ZELLEN[a.dataset.id] ||= []).push(a));
  const st = ['neu', 'umbenannt', 'auslaufend', 'abgekuendigt'];
  $('#status-filter').innerHTML = st.map(s => {
    const n = K.DATA.filter(d => d.status === s).length;
    return `<button class="legende__knopf" type="button" aria-pressed="false" data-status-filter="${s}"><span class="status" data-status="${s}">${esc(STATUS[s])}</span><span class="legende__zahl">${n}</span></button>`;
  }).join('') + `<span class="legende__aktiv">ohne Kennzeichen: aktiv <span class="legende__zahl">${K.DATA.filter(d => d.status === 'aktiv').length}</span></span>`;
  const zahl = k => K.DATA.filter(d => d.belegt === k).length;
  $('#lead-zahl').textContent = K.DATA.length;
  $('#h-ja').textContent = zahl('ja'); $('#h-teilweise').textContent = zahl('teilweise'); $('#h-nein').textContent = zahl('nein');
}

/* Suche und Status hervorheben: der Schnitt bleibt stehen, was nicht passt, tritt zurück */
function hervorheben() {
  const t = treffer(zustand.q);
  const aktiv = t !== null || !!zustand.s;
  let n = 0;
  K.DATA.forEach(d => {
    const passt = (!t || t.has(d.id)) && (!zustand.s || d.status === zustand.s);
    if (passt) n++;
    (ZELLEN[d.id] || []).forEach(a => { a.classList.toggle('ist-blass', aktiv && !passt); a.classList.toggle('ist-treffer', aktiv && passt); });
  });
  $('#schnitt-feld').classList.toggle('hat-filter', aktiv);
  $('#trefferzahl').textContent = aktiv ? (n === 1 ? '1 Treffer' : `${n} Treffer`) : `${K.DATA.length} Bausteine`;
  $('[data-suche-leeren]').hidden = !zustand.q;
  $$('[data-status-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.statusFilter === zustand.s)));
}

/* Lesezeile: der Baustein unter dem Zeiger oder im Fokus, mit seinen Verbindungen */
const LESE_RUHE = `<span class="lesezeile__ruhe">Auf einen Baustein zeigen: Kurzbeschreibung und Verbindungen. Ein Klick öffnet den Steckbrief.</span>`;
function zeigen(id) {
  if (id === letzte) return;
  letzte = id;
  $$('#schnitt-feld .ist-verwandt, #schnitt-feld .ist-zeiger').forEach(a => a.classList.remove('ist-verwandt', 'ist-zeiger'));
  const zeile = $('#lesezeile');
  if (!id) { zeile.innerHTML = LESE_RUHE; zeile.classList.remove('ist-belegt'); return; }
  const d = K.byId[id];
  const rel = [...K.REL[id]];
  rel.forEach(r => (ZELLEN[r] || []).forEach(a => a.classList.add('ist-verwandt')));
  (ZELLEN[id] || []).forEach(a => a.classList.add('ist-zeiger'));
  zeile.classList.add('ist-belegt');
  zeile.innerHTML = `${statusTag(d)}<span class="lesezeile__name">${esc(d.name)}</span><span class="lesezeile__kurz">${esc(d.kurz)}</span>
    <span class="lesezeile__rel"><span class="lesezeile__farbe" aria-hidden="true"></span>${rel.length} ${rel.length === 1 ? 'Verbindung' : 'Verbindungen'}</span>`;
}

/* ------------------------------------------------------------ das Blatt */
function lageHtml(d) {
  const o = ORT[d.id];
  if (!o) return '';
  const mini = ort => PLAN.filter(b => b.ort === ort).map(b => `<span class="lage__band lage__band--${b.art || 'normal'}${b === o.band ? ' ist-hier' : ''}" data-band="${b.id}"></span>`).join('');
  const nachbarn = o.nachbarn.filter(id => id !== d.id);
  return `<section class="sb__feld lage">
    <h3>Lage im Schnitt</h3>
    <a class="lage__karte" href="./" data-zum-schnitt aria-label="Im Schnitt zeigen: ${esc(o.band.titel)}">
      <span class="lage__seite">${mini('links')}</span><span class="lage__mitte">${mini('mitte')}</span><span class="lage__seite">${mini('rechts')}</span>
    </a>
    <p class="lage__text">${esc(o.band.titel)}${o.gruppe ? ` · ${esc(o.gruppe.titel)}` : ''}</p>
    ${nachbarn.length ? `<h3 class="lage__neben">Daneben im Schnitt</h3><div class="chips chips--eng">${nachbarn.map(id => `<a class="chip" href="${esc(urlFuer({ b: id }))}" data-id="${esc(id)}">${esc(kurz(id))}</a>`).join('')}</div>` : ''}
  </section>`;
}
function blattHtml(d) {
  return `<article class="blatt__artikel" aria-labelledby="sb-name">
    <header class="blatt__kopf">
      ${sbTitel(d, { tag: 'h1' })}
      <p class="sb__kurz">${esc(d.kurz)}</p>
      ${sbStatus(d)}
    </header>
    <div class="blatt__raster">
      <div class="blatt__text">
        ${sbFelder(d)}
        ${sbTest(d)}
        ${feld('Lizenz', d.lizenz)}
        ${sbBeleg(d)}
        ${sbQuellen(d)}
      </div>
      <aside class="blatt__rand" aria-label="Lage, Daten und Verwandte">
        ${lageHtml(d)}
        ${sbDaten(d)}
        ${sbVerwandt(d)}
      </aside>
    </div>
  </article>`;
}

/* ------------------------------------------------------------ Ansichten */
function allesZeigen({ fokus = false } = {}) {
  const d = zustand.b ? K.byId[zustand.b] : null;
  $('#v-schnitt').hidden = !!d;
  $('#v-blatt').hidden = !d;
  if ($('#q').value !== zustand.q) $('#q').value = zustand.q;
  hervorheben();
  if (d) {
    $('#blatt').innerHTML = blattHtml(d);
    if (fokus) { window.scrollTo(0, 0); $('#sb-name').focus({ preventScroll: true }); }
    ansage(`Steckbrief ${d.name} geöffnet`);
  } else {
    $('#blatt').innerHTML = '';
    ansage('');
  }
  testZeigen();
  linksAktualisieren();
  $$('[data-zum-schnitt]').forEach(a => { if (!a.dataset.zumSchnitt) a.href = urlFuer({ b: '' }); });
  document.title = (d ? `${d.name} · ` : '') + 'S/4HANA-Landkarte im Schnitt: SAP-Bausteine an ihrem Platz in der Architektur';
}
function waehle(id, ausloeser) {
  if (!zustand.b) schnittScroll = window.scrollY;
  zeigen('');
  zustand.b = id;
  urlSchreiben('push');
  allesZeigen({ fokus: true });
}
function zumSchnitt(anker) {
  const war = zustand.b;
  if (war) { zustand.b = ''; urlSchreiben('push'); allesZeigen(); }
  if (anker) { document.getElementById(anker)?.scrollIntoView({ block: 'start' }); return; }
  if (war) {
    window.scrollTo(0, schnittScroll);
    const a = (ZELLEN[war] || [])[0];
    if (a) { a.focus({ preventScroll: true }); const r = a.getBoundingClientRect(); if (r.top < 80 || r.bottom > innerHeight - 80) a.scrollIntoView({ block: 'center' }); }
  }
}

let sucheTimer = null;
function sucheSetzen(wert) {
  zustand.q = wert;
  if ($('#q').value !== wert) $('#q').value = wert;
  hervorheben();
  clearTimeout(sucheTimer);
  sucheTimer = setTimeout(() => { urlSchreiben('replace'); linksAktualisieren(); }, 250);
}

function bedienung() {
  document.addEventListener('click', e => {
    const zs = e.target.closest('[data-zum-schnitt]');
    if (zs && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); zumSchnitt(zs.dataset.zumSchnitt || ''); if (!zs.dataset.zumSchnitt && zs.classList.contains('nav__logo')) window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-zur-suche]')) { e.preventDefault(); zumSchnitt(''); window.scrollTo(0, 0); $('#q').focus({ preventScroll: true }); return; }
    const sf = e.target.closest('[data-status-filter]');
    if (sf) { zustand.s = zustand.s === sf.dataset.statusFilter ? '' : sf.dataset.statusFilter; urlSchreiben('replace'); hervorheben(); linksAktualisieren(); return; }
    if (e.target.closest('[data-suche-leeren]')) { sucheSetzen(''); $('#q').focus(); }
  }, true);
  anbinden({ waehle });

  const q = $('#q');
  q.addEventListener('input', () => sucheSetzen(q.value));
  q.addEventListener('keydown', e => {
    if (e.key === 'Escape' && zustand.q) { e.preventDefault(); sucheSetzen(''); }
    if ((e.key === 'Enter' || e.key === 'ArrowDown') && zustand.q) {
      const erste = $('#schnitt-feld a.zelle.ist-treffer');
      if (erste) { e.preventDefault(); erste.focus(); erste.scrollIntoView({ block: 'center' }); }
    }
  });

  // Zeigen und Fokus füllen die Lesezeile; beim Verlassen des Schnitts ruht sie
  const feldEl = $('#schnitt-feld');
  feldEl.addEventListener('pointerover', e => { if (e.pointerType === 'touch') return; const a = e.target.closest('a.zelle'); if (a) zeigen(a.dataset.id); });
  feldEl.addEventListener('pointerleave', () => { if (!feldEl.contains(document.activeElement)) zeigen(''); });
  feldEl.addEventListener('focusin', e => { const a = e.target.closest('a.zelle'); if (a) zeigen(a.dataset.id); });
  feldEl.addEventListener('focusout', e => { if (!feldEl.contains(e.relatedTarget)) zeigen(''); });

  window.addEventListener('popstate', () => { const war = zustand.b; urlLesen(); allesZeigen(); if (war && !zustand.b) window.scrollTo(0, schnittScroll); else if (zustand.b) window.scrollTo(0, 0); });
}

async function start() {
  bedienung();
  try { await laden(); } catch (err) { ladefehler($('#schnitt-feld'), err); return; }
  urlLesen();
  planBauen();
  schnittBauen();
  $('#lesezeile').innerHTML = LESE_RUHE;
  history.replaceState({ app: true }, '', urlFuer());
  allesZeigen();
  document.documentElement.dataset.geladen = '1';
}
start();
