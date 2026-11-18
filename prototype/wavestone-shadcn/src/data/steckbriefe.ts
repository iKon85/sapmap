// PROTOTYP: echte Daten aus data/steckbriefe.json, Konstanten aus src/landkarte.html übernommen.
import raw from "../../../../data/steckbriefe.json"

export type Status =
  | "aktiv"
  | "neu"
  | "umbenannt"
  | "auslaufend"
  | "abgekuendigt"
export type Belegt = "ja" | "teilweise" | "nein"
export type Layer =
  | "core"
  | "ext"
  | "btp"
  | "ai"
  | "int"
  | "data"
  | "lob"
  | "tool"
  | "mig"
  | "pm"
  | "sec"
  | "ops"
export type Zone =
  | "core"
  | "ext"
  | "plat"
  | "ai"
  | "int"
  | "data"
  | "lob"
  | "proj"
  | "quer"

export interface Steckbrief {
  id: string
  layer: Layer
  parent?: string | null
  name: string
  aka?: Array<string>
  kurz: string
  was?: string
  wie?: string
  s4?: string
  wann?: string
  test?: string
  lizenz?: string
  status: Status
  statusText?: string
  daten?: Array<{ datum: string; text: string }>
  verwandt?: Array<string>
  quellen?: Array<{ titel?: string; url?: string }>
  belegt: Belegt
  hinweis?: string
}

export const DATA = raw as Array<Steckbrief>

// Clean Core bekommt im Prototyp eine eigene Zone (eigene Spalte), heute teilt es sich die Farbe mit dem Kern.
export const LAYERS: Record<Layer, { n: string; z: Zone }> = {
  core: { n: "S/4HANA-Kern & Deployment", z: "core" },
  ext: { n: "Clean Core & Erweiterbarkeit", z: "ext" },
  btp: { n: "Plattform & Entwicklung", z: "plat" },
  ai: { n: "Business AI & Joule", z: "ai" },
  int: { n: "Integration", z: "int" },
  data: { n: "Daten & Analytics", z: "data" },
  lob: { n: "LoB-Cloud-Apps & Branchen", z: "lob" },
  tool: { n: "Toolchain, ALM & Test", z: "proj" },
  mig: { n: "Migration & Transformation", z: "proj" },
  pm: { n: "Einführungsprojekt steuern", z: "proj" },
  sec: { n: "Security, Identity & GRC", z: "quer" },
  ops: { n: "Betrieb & Infrastruktur", z: "quer" },
}

export const ZDESC: Partial<Record<Layer, string>> = {
  core: "Das ERP selbst, seine Betriebsvarianten und die eingebauten Komponenten, darunter das Projektmanagement des Unternehmens (PS, EPPM, CPM).",
  ext: "Wie man S/4HANA erweitert, ohne den Kern zu verbiegen.",
  lob: "SaaS-Lösungen, die S/4HANA fachlich ergänzen, plus Utilities.",
  sec: "Querschnitt: Identitäten, Berechtigungen, Compliance.",
  ops: "Wer betreibt was, wo läuft es, welche Werkzeuge helfen.",
  int: "Das Bindegewebe: Schnittstellen, Events, Replikation. Ersetzt PI/PO.",
  pm: "Methodik und Werkzeuge, um die S/4HANA-Einführung selbst zu planen und zu steuern. Projektmanagement als Fachfunktion (PS, EPPM, CPM) steckt im S/4HANA-Kern.",
}

export const DEPLOY = ["s4-cloud-erp", "s4-private", "s4-onprem"]

export const ALSO: Record<string, Array<Layer>> = {
  "data-services": ["mig"],
  slt: ["mig"],
  atc: ["mig"],
  "business-partner": ["mig"],
  "migration-assessment": ["mig"],
  "embedded-analytics": ["data"],
  "hana-cloud": ["data"],
}

export const ST: Record<Status, string> = {
  aktiv: "aktiv",
  neu: "neu",
  umbenannt: "umbenannt",
  auslaufend: "läuft aus",
  abgekuendigt: "abgekündigt",
}
export const BEL: Record<Belegt, string> = {
  ja: "belegt",
  teilweise: "teilweise belegt",
  nein: "unbelegt",
}

export const byId: Record<string, Steckbrief | undefined> = Object.fromEntries(
  DATA.map((d) => [d.id, d])
)
export const order: Record<string, number> = Object.fromEntries(
  DATA.map((d, i) => [d.id, i])
)
export const inLayer = (l: Layer) => DATA.filter((d) => d.layer === l)
export const zoneOf = (d: Steckbrief): Zone => LAYERS[d.layer].z

// Rückverweise ergänzen: wer mich als verwandt nennt, ist auch mit mir verwandt
export const REL: Record<string, Set<string>> = {}
DATA.forEach((d) => {
  REL[d.id] = new Set((d.verwandt ?? []).filter((x) => byId[x] && x !== d.id))
})
DATA.forEach((d) => REL[d.id].forEach((x) => REL[x].add(d.id)))

export const KIDS: Record<string, Array<string> | undefined> = {}
DATA.forEach((d) => {
  if (d.parent && byId[d.parent]) (KIDS[d.parent] ??= []).push(d.id)
})

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[/-]/g, " ")
const HAY: Record<string, string> = Object.fromEntries(
  DATA.map((d) => [
    d.id,
    norm([d.name, (d.aka ?? []).join(" "), d.kurz, d.was ?? "", d.id].join(" ")),
  ])
)

/** Wie heute: Suchbegriffe und Status-Filter blenden nicht passende Bausteine ab. */
export function matches(d: Steckbrief, q: string, status: string): boolean {
  const terms = norm(q).trim().split(/\s+/).filter(Boolean)
  const st = d.status === "abgekuendigt" ? "auslaufend" : d.status
  return (
    terms.every((t) => HAY[d.id].includes(t)) &&
    (status === "all" || st === status)
  )
}

export function fmtDate(s: string): string {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(s)
  if (!m) return s
  if (m[3]) return `${m[3]}.${m[2]}.${m[1]}`
  if (m[2]) return `${m[2]}/${m[1]}`
  return m[1]
}
