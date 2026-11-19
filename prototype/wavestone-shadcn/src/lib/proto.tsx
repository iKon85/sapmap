// PROTOTYP: Zustand der Seite. Auswahl und Varianten stehen in der URL, Suche/Filter/Testperspektive im Speicher.
import * as React from "react"
import { byId } from "@/data/steckbriefe"

export const LAYOUTS = [
  { key: "a", kurz: "A", name: "Fünf Spalten" },
  { key: "b", kurz: "B", name: "Security als Zeile" },
  { key: "c", kurz: "C", name: "Clean Core als Band" },
] as const
export const FARBEN = [
  { key: "tonstufen", kurz: "1", name: "Tonstufen" },
  { key: "infografik", kurz: "2", name: "Infografik" },
  { key: "ruhig", kurz: "3", name: "Ruhig" },
] as const
export const STECKBRIEF = [
  { key: "overlay", kurz: "", name: "überlagert" },
  { key: "spalte", kurz: "", name: "angedockt" },
] as const

export const KANTE = [
  { key: "oben", kurz: "", name: "mit Oberkante" },
  { key: "ohne", kurz: "", name: "ohne" },
] as const

export type LayoutKey = (typeof LAYOUTS)[number]["key"]
export type FarbenKey = (typeof FARBEN)[number]["key"]
export type SteckbriefKey = (typeof STECKBRIEF)[number]["key"]
export type KanteKey = (typeof KANTE)[number]["key"]

/** Search-Params; Standardwerte bleiben aus der URL heraus. */
export interface ProtoSearch {
  b?: string
  layout?: LayoutKey
  farben?: FarbenKey
  steckbrief?: SteckbriefKey
  kante?: KanteKey
}

export function validateProtoSearch(s: Record<string, unknown>): ProtoSearch {
  const layout = String(s.layout ?? "")
  const farben = String(s.farben ?? "")
  const b = typeof s.b === "string" && byId[s.b] ? s.b : undefined
  return {
    ...(b ? { b } : {}),
    ...(layout === "b" || layout === "c" ? { layout } : {}),
    ...(farben === "infografik" || farben === "ruhig" ? { farben } : {}),
    ...(s.steckbrief === "spalte" ? { steckbrief: "spalte" as const } : {}),
    ...(s.kante === "ohne" ? { kante: "ohne" as const } : {}),
  }
}

export type Theme = "light" | "dark" | "system"

export interface Proto {
  sel: string | undefined
  layout: LayoutKey
  farben: FarbenKey
  steckbrief: SteckbriefKey
  kante: KanteKey
  q: string
  setQ: (q: string) => void
  status: string
  setStatus: (s: string) => void
  test: boolean
  setTest: (t: boolean) => void
  theme: Theme
  setTheme: (t: Theme) => void
}

export const ProtoContext = React.createContext<Proto | null>(null)
export function useProto(): Proto {
  const ctx = React.useContext(ProtoContext)
  if (!ctx) throw new Error("ProtoContext fehlt")
  return ctx
}

export function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener("change", cb)
      return () => m.removeEventListener("change", cb)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}
