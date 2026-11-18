import { Link } from "@tanstack/react-router"
import { cn } from "cn"
import type { Layer, Steckbrief } from "@/data/steckbriefe"
import {
  ALSO,
  DATA,
  DEPLOY,
  LAYERS,
  ZDESC,
  byId,
  inLayer,
} from "@/data/steckbriefe"
import { Chip, StatusMark, useBausteinState } from "@/components/chip"
import { useProto } from "@/lib/proto"

function Tile({ d }: { d: Steckbrief }) {
  const s = useBausteinState(d)
  return (
    <Link
      to="."
      search={(prev) => ({ ...prev, b: s.sel ? undefined : d.id })}
      replace
      resetScroll={false}
      aria-current={s.sel ? "true" : undefined}
      className={cn("tile", s.sel && "sel", s.rel && "rel", s.miss && "miss")}
    >
      <b>{d.name}</b>
      <span>{d.kurz}</span>
    </Link>
  )
}

function Zone({
  layer,
  className,
  desc = true,
}: {
  layer: Layer
  className?: string
  desc?: boolean
}) {
  const L = LAYERS[layer]
  let items = inLayer(layer).concat(
    DATA.filter((d) => (ALSO[d.id] ?? []).includes(layer))
  )
  const tiles =
    layer === "core"
      ? DEPLOY.map((id) => byId[id]).filter((d) => d !== undefined)
      : []
  if (layer === "core") items = items.filter((d) => !DEPLOY.includes(d.id))
  return (
    <section
      data-zone={L.z}
      aria-label={L.n}
      className={cn("zone", `z-${layer}`, className)}
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3>{L.n}</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {inLayer(layer).length}
        </span>
      </div>
      {desc && ZDESC[layer] ? (
        <p className="-mt-1 mb-2 text-xs text-muted-foreground">
          {ZDESC[layer]}
        </p>
      ) : null}
      {tiles.length ? (
        <div className="tiles">
          {tiles.map((d) => (
            <Tile key={d.id} d={d} />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-[5px]">
        {items.map((d) => (
          <Chip key={d.id} d={d} homeLayer={layer} />
        ))}
      </div>
    </section>
  )
}

function Gruppe({
  zone,
  titel,
  unter,
  className,
  children,
}: {
  zone: string
  titel: string
  unter: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-zone={zone} className={cn("gruppe", className)}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h2>{titel}</h2>
        <span className="text-xs text-muted-foreground">{unter}</span>
      </div>
      {children}
    </div>
  )
}

export function Landkarte() {
  const { sel, layout } = useProto()
  return (
    <div className="karte-wrap">
      <div
        className={cn("karte", sel && "has-sel")}
        data-layout={layout}
        data-karte
      >
        <Gruppe
          zone="proj"
          titel="Projekt & Lebenszyklus"
          unter="Werkzeuge, mit denen die Einführung geplant, gebaut, getestet und überführt wird"
          className="a-proj"
        >
          <div className="subgrid proj">
            <Zone layer="tool" desc={false} />
            <Zone layer="mig" desc={false} />
            <Zone layer="pm" />
          </div>
        </Gruppe>

        <Zone layer="lob" className="a-lob" />
        <Zone layer="core" className="a-core" />

        <div className="naht a-ext">
          <div className="naht-label">
            Clean-Core-Grenze · Erweiterungen nur über freigegebene
            Schnittstellen
          </div>
          <Zone layer="ext" />
          <div className="naht-linie" aria-hidden>
            <span>Clean-Core-Grenze · nur freigegebene Schnittstellen</span>
          </div>
        </div>

        <Gruppe
          zone="plat"
          titel="SAP BTP · Business AI Platform"
          unter="Seite an Seite neben dem Kern"
          className="a-plat"
        >
          <div className="subgrid plat">
            <Zone layer="int" />
            <Zone layer="btp" desc={false} />
            <Zone layer="data" desc={false} />
            <Zone layer="ai" desc={false} />
          </div>
        </Gruppe>

        <Zone layer="sec" className="a-sec" />
        <Zone layer="ops" className="a-ops" />
      </div>
    </div>
  )
}

export function Legende({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <li className="flex items-center gap-1.5">
        <span className="size-[7px] rounded-full bg-muted-foreground" />
        aktiv
      </li>
      <li className="flex items-center gap-1.5">
        <StatusMark status="neu" />
        neu seit 2025
      </li>
      <li className="flex items-center gap-1.5">
        <StatusMark status="umbenannt" />
        umbenannt
      </li>
      <li className="flex items-center gap-1.5">
        <StatusMark status="auslaufend" />
        läuft aus
      </li>
      <li className="flex items-center gap-1.5">
        <StatusMark status="abgekuendigt" />
        abgekündigt
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-4.5 rounded-[3px] border border-dashed border-input" />
        unbelegt
      </li>
      <li>↗ auch in einem anderen Bereich zu Hause</li>
      <li>Auswahl aufheben: erneut klicken oder Esc</li>
    </ul>
  )
}
