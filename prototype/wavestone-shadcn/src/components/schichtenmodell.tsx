import { Link } from "@tanstack/react-router"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import type { BoxCfg, BoxColor, Item, Richtung } from "@/data/schichten"
import {
  APP,
  BUS,
  DB,
  INFRA,
  LC,
  S4,
  SEC,
  UI,
  VERB_APP_BUS,
  VERB_BUS_S4,
} from "@/data/schichten"
import { byId } from "@/data/steckbriefe"
import { Chip } from "@/components/chip"
import { useProto } from "@/lib/proto"

// Kastenfarbe → Bereichsfarbe der Landkarte
const ZONE: Record<BoxColor, string> = {
  ui: "neutral",
  saas: "lob",
  btp: "plat",
  ai: "ai",
  bdc: "data",
  non: "neutral",
  bus: "int",
  s4: "core",
  cc: "ext",
  in: "",
  quer: "quer",
  lc: "proj",
}

function Eintrag({ it }: { it: Item }) {
  if (typeof it === "string") return <span className="sm-plain">{it}</span>
  const d = byId[it[0]]
  if (!d) return null
  return <Chip d={d} label={it[1] ?? d.name} small />
}

function Titel({ t, tid }: { t: string; tid?: string }) {
  const { sel } = useProto()
  if (!tid || !byId[tid]) return <div className="sm-t">{t}</div>
  return (
    <div className="sm-t">
      <Link
        to="."
        search={(prev) => ({ ...prev, b: sel === tid ? undefined : tid })}
        replace
        resetScroll={false}
        className={cn(
          "inline-flex items-center gap-0.5 rounded-sm hover:text-link hover:underline",
          sel === tid && "text-link underline"
        )}
      >
        {t}
        <CaretRightIcon weight="bold" className="size-3" aria-hidden />
      </Link>
    </div>
  )
}

function Box({
  cfg,
  className,
  note,
}: {
  cfg: Omit<BoxCfg, "cls"> & { cls?: BoxColor }
  className?: string
  note?: React.ReactNode
}) {
  const cls = cfg.cls ?? "in"
  return (
    <div
      className={cn("sm-box", `c-${cls}`, className)}
      data-zone={ZONE[cls] || undefined}
    >
      {cfg.t ? <Titel t={cfg.t} tid={cfg.tid} /> : null}
      {note}
      {cfg.items?.length ? (
        <div className="flex flex-wrap gap-[5px]">
          {cfg.items.map((it, i) => (
            <Eintrag key={i} it={it} />
          ))}
        </div>
      ) : null}
      {cfg.sub?.length ? (
        <div className={cn("sm-sub", cfg.items?.length && "mt-2")}>
          {cfg.sub.map((s) => (
            <Box key={s.t} cfg={s} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Verbindung({ text, dir }: { text: string; dir: Richtung }) {
  const Icon =
    dir === "beide"
      ? ArrowsDownUpIcon
      : dir === "hoch"
        ? ArrowUpIcon
        : ArrowDownIcon
  const sr =
    dir === "beide"
      ? "in beide Richtungen"
      : dir === "hoch"
        ? "nach oben"
        : "nach unten"
  return (
    <span className="sm-verb">
      <Icon weight="bold" className="size-3.5" aria-hidden />
      {text}
      <span className="sr-only"> ({sr})</span>
    </span>
  )
}

const Zeile = ({ children }: { children: React.ReactNode }) => (
  <div className="sm-rowlab">{children}</div>
)

/** Schichtenmodell als CSS-Grid aus HTML-Kästen. Die Pfeile der alten Grafik stehen als beschriftete Verbindungen zwischen den Schichten. */
export function Schichtenmodell() {
  const { sel } = useProto()
  const cc = byId["cloud-connector"]
  return (
    <div className="sm-wrap">
      <div className={cn("sm", sel && "has-sel")} data-sm>
        <div className="sm-sec">
          <Zeile>Querschnitt</Zeile>
          <Box
            cfg={SEC}
            className="mt-1.5"
            note={
              <p className="mb-2 text-xs text-muted-foreground">
                Identitäten und Rollen für alle Schichten
              </p>
            }
          />
        </div>

        <div className="sm-mid">
          <Zeile>Anwender & Kanäle</Zeile>
          <div className="sm-cols">
            {UI.map((b, i) => (
              <Box key={i} cfg={b} />
            ))}
          </div>

          <Zeile>Anwendungen neben dem Kern</Zeile>
          <div className="sm-cols">
            {APP.map((b) => (
              <Box key={b.t} cfg={b} />
            ))}
          </div>
          <div className="sm-cols py-1" aria-label="Verbindungen zur Integration">
            {VERB_APP_BUS.map((v) => (
              <div key={v.text} className="flex justify-center">
                <Verbindung text={v.text} dir={v.dir} />
              </div>
            ))}
          </div>

          <Zeile>Integration & Events</Zeile>
          <Box cfg={BUS} />

          <div className="flex flex-wrap justify-around gap-x-4 gap-y-1 pt-1.5">
            {VERB_BUS_S4.map((v) => (
              <Verbindung key={v.text} text={v.text} dir={v.dir} />
            ))}
          </div>
          <div className="sm-grenze">
            <Link
              to="."
              search={(prev) => ({
                ...prev,
                b: sel === "clean-core" ? undefined : "clean-core",
              })}
              replace
              resetScroll={false}
              className="inline-flex items-center gap-0.5 text-xs font-semibold hover:underline"
              style={{ color: "var(--cc-line)" }}
            >
              Clean-Core-Grenze: nur freigegebene APIs
              <CaretRightIcon weight="bold" className="size-3" aria-hidden />
            </Link>
            {cc ? <Chip d={cc} label="Cloud Connector" small plainZone /> : null}
          </div>

          <Zeile>S/4HANA-Kern</Zeile>
          <Box cfg={S4} />
          <Zeile>Datenbank</Zeile>
          <Box cfg={DB} />
          <Zeile>Infrastruktur & Betrieb</Zeile>
          <Box cfg={INFRA} />
        </div>

        <div className="sm-lc">
          <Zeile>Projekt</Zeile>
          <Box
            cfg={LC}
            className="mt-1.5"
            note={
              <p className="mb-2 text-xs text-muted-foreground">
                Tests und Transporte in den Kern
              </p>
            }
          />
        </div>
      </div>
    </div>
  )
}
