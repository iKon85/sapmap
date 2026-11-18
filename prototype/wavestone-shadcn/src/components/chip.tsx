import { Link } from "@tanstack/react-router"
import {
  ArrowUpRightIcon,
  ArrowsClockwiseIcon,
  HourglassMediumIcon,
  ProhibitIcon,
  SparkleIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import type { Layer, Status, Steckbrief } from "@/data/steckbriefe"
import { LAYERS, REL, ST, matches, zoneOf } from "@/data/steckbriefe"
import { useProto } from "@/lib/proto"

/** Statuszeichen: Farbe plus Piktogramm, nie Farbe allein (Charta, Barrierefreiheit). */
export function StatusMark({ status }: { status: Status }) {
  if (status === "aktiv") return <span className="dot" aria-hidden />
  const Icon = {
    neu: SparkleIcon,
    umbenannt: ArrowsClockwiseIcon,
    auslaufend: HourglassMediumIcon,
    abgekuendigt: ProhibitIcon,
  }[status]
  return (
    <span className={cn("stmark", status)}>
      <Icon weight="bold" aria-hidden />
      <span className="sr-only">{ST[status]}: </span>
    </span>
  )
}

/** Zustand eines Bausteins relativ zu Auswahl und Filter. */
export function useBausteinState(d: Steckbrief) {
  const { sel, q, status } = useProto()
  return {
    sel: sel === d.id,
    rel: !!sel && REL[sel].has(d.id),
    miss: !matches(d, q, status),
  }
}

export function Chip({
  d,
  label,
  homeLayer,
  small,
  plainZone,
}: {
  d: Steckbrief
  /** Kurzlabel, z. B. im Schichtenmodell */
  label?: string
  /** Bereich, in dem der Chip gerade steht; weicht er vom Heimatbereich ab, erscheint ↗ */
  homeLayer?: Layer
  small?: boolean
  /** Farbe des eigenen Bereichs setzen (für Chips außerhalb ihrer Zone, z. B. im Steckbrief) */
  plainZone?: boolean
}) {
  const s = useBausteinState(d)
  const away = homeLayer && homeLayer !== d.layer
  return (
    <Link
      to="."
      search={(prev) => ({ ...prev, b: s.sel ? undefined : d.id })}
      replace
      resetScroll={false}
      data-zone={plainZone ? zoneOf(d) : undefined}
      data-status={d.status}
      title={label ? `${d.name}: ${d.kurz}` : d.kurz}
      aria-current={s.sel ? "true" : undefined}
      className={cn(
        "chip",
        small && "small",
        d.parent && !label && "child",
        d.belegt === "nein" && "unv",
        s.sel && "sel",
        s.rel && "rel",
        s.miss && "miss"
      )}
    >
      {d.parent && !label ? (
        <span aria-hidden className="-mr-0.5 text-muted-foreground">
          ↳
        </span>
      ) : null}
      <StatusMark status={d.status} />
      <span className="nm">{label ?? d.name}</span>
      {away ? (
        <ArrowUpRightIcon
          aria-label={`gehört zu ${LAYERS[d.layer].n}`}
          className="size-3 flex-none opacity-60"
        />
      ) : null}
    </Link>
  )
}
