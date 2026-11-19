// PROTOTYP-Umschalter: gehört nicht zum Entwurf. Schaltet Layout, Farben und Steckbrief-Modus über die URL.
import * as React from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { cn } from "cn"
import type { ProtoSearch } from "@/lib/proto"
import { FARBEN, KANTE, LAYOUTS, STECKBRIEF, useProto } from "@/lib/proto"

function Gruppe<TKey extends string>({
  titel,
  param,
  optionen,
  aktuell,
  standard,
  className,
}: {
  titel: string
  param: keyof ProtoSearch
  optionen: ReadonlyArray<{ key: TKey; kurz: string; name: string }>
  aktuell: TKey
  standard: TKey
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="mr-0.5 text-[11px] tracking-wide text-white/60 uppercase">
        {titel}
      </span>
      {optionen.map((o) => (
        <Link
          key={o.key}
          to="."
          search={(prev) => ({
            ...prev,
            [param]: o.key === standard ? undefined : o.key,
          })}
          replace
          resetScroll={false}
          title={o.name}
          aria-current={o.key === aktuell ? "true" : undefined}
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
            o.key === aktuell
              ? "bg-white text-black"
              : "text-white/85 hover:bg-white/15"
          )}
        >
          {o.kurz ? (
            <>
              {o.kurz}
              <span className="max-[1099px]:hidden"> · {o.name}</span>
            </>
          ) : (
            o.name
          )}
        </Link>
      ))}
    </div>
  )
}

export function PrototypeSwitcher() {
  const { layout, farben, steckbrief, kante } = useProto()
  const navigate = useNavigate()
  const [mass, setMass] = React.useState<{ fenster: number; grafik: number }>()

  React.useEffect(() => {
    const messen = () => {
      const el = document.querySelector<HTMLElement>("[data-karte],[data-sm]")
      setMass({
        fenster: window.innerWidth,
        grafik: Math.round(el?.getBoundingClientRect().width ?? 0),
      })
    }
    messen()
    const ro = new ResizeObserver(messen)
    ro.observe(document.body)
    window.addEventListener("resize", messen)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", messen)
    }
  }, [layout, steckbrief])

  // Pfeiltasten blättern durch die Layouts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      const t = e.target as HTMLElement
      if (t.closest("input, textarea, [contenteditable]")) return
      const i = LAYOUTS.findIndex((l) => l.key === layout)
      const n =
        LAYOUTS[
          (i + (e.key === "ArrowRight" ? 1 : -1) + LAYOUTS.length) %
            LAYOUTS.length
        ].key
      void navigate({
        to: ".",
        search: (prev) => ({ ...prev, layout: n === "a" ? undefined : n }),
        replace: true,
        resetScroll: false,
      })
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [layout, navigate])

  if (import.meta.env.PROD) return null
  return (
    <div data-proto-bar className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-2">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-2xl bg-black/90 px-3.5 py-1.5 text-white shadow-xl ring-1 ring-white/20">
        <Gruppe
          titel="Layout"
          param="layout"
          optionen={LAYOUTS}
          aktuell={layout}
          standard="a"
        />
        <Gruppe
          titel="Farben"
          param="farben"
          optionen={FARBEN}
          aktuell={farben}
          standard="tonstufen"
        />
        <Gruppe
          titel="Steckbrief"
          param="steckbrief"
          optionen={STECKBRIEF}
          aktuell={steckbrief}
          standard="overlay"
          className="max-[899px]:hidden"
        />
        <Gruppe
          titel="Kante"
          param="kante"
          optionen={KANTE}
          aktuell={kante}
          standard="oben"
        />
        {mass ? (
          <span className="font-mono text-[11px] text-white/60 max-[639px]:hidden">
            Fenster {mass.fenster} · Grafik {mass.grafik} px
          </span>
        ) : null}
      </div>
    </div>
  )
}
