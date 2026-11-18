import * as React from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import type { Belegt, Status, Steckbrief } from "@/data/steckbriefe"
import {
  BEL,
  KIDS,
  LAYERS,
  REL,
  ST,
  byId,
  fmtDate,
  order,
  zoneOf,
} from "@/data/steckbriefe"
import { Chip, StatusMark } from "@/components/chip"
import { Legende } from "@/components/landkarte"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { useMediaQuery, useProto } from "@/lib/proto"

function Abschnitt({
  titel,
  children,
  className,
}: {
  titel: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("mt-2.5 border-t pt-2.5", className)}>
      <h4 className="mb-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {titel}
      </h4>
      {children}
    </section>
  )
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        status === "neu" && "border-transparent bg-(--st-neu) text-black",
        status === "auslaufend" && "border-transparent bg-(--st-aus) text-black",
        status === "abgekuendigt" &&
          "border-transparent bg-(--st-abg) text-black",
        status === "umbenannt" && "border-(--st-umb) text-(--st-umb)",
        status === "aktiv" && "text-muted-foreground"
      )}
    >
      {status === "aktiv" ? null : (
        <span className="[&_.stmark]:size-3 [&_.stmark]:bg-transparent [&_.stmark]:text-current [&_.stmark]:shadow-none">
          <StatusMark status={status} />
        </span>
      )}
      {ST[status]}
    </span>
  )
}

function BelegtBadge({ belegt }: { belegt: Belegt }) {
  return (
    <span
      className={cn(
        "ml-1.5 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold tracking-normal normal-case",
        belegt === "ja" && "text-foreground",
        belegt === "teilweise" && "border-transparent bg-(--st-aus) text-black",
        belegt === "nein" && "border-transparent bg-(--st-abg) text-black"
      )}
    >
      {BEL[belegt]}
    </span>
  )
}

function BausteinLink({ id }: { id: string }) {
  const d = byId[id]
  if (!d) return null
  return (
    <Link
      to="."
      search={(prev) => ({ ...prev, b: id })}
      replace
      resetScroll={false}
      className="text-link underline underline-offset-2"
    >
      {d.name}
    </Link>
  )
}

/** Inhalt eines Steckbriefs, Felder und Reihenfolge wie auf der heutigen Seite. */
export function SteckbriefInhalt({ d }: { d: Steckbrief }) {
  const { test } = useProto()
  const L = LAYERS[d.layer]
  const kids = KIDS[d.id] ?? []
  const dates = (d.daten ?? []).filter((x) => x.text)
  const rel = [...REL[d.id]]
    .filter((x) => !kids.includes(x) && x !== d.parent)
    .sort((a, b) => order[a] - order[b])
  const src = (d.quellen ?? []).filter((s) => /^https?:\/\//.test(s.url ?? ""))
  const text = (titel: string, body?: string) =>
    body ? (
      <Abschnitt titel={titel}>
        <p>{body}</p>
      </Abschnitt>
    ) : null
  return (
    <div data-zone={zoneOf(d)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-(--zc) uppercase">
        <span className="size-2.5 rounded-[2px] bg-(--zc)" />
        {L.n}
      </div>
      {d.parent && byId[d.parent] ? (
        <div className="mt-1 text-[13px] text-muted-foreground">
          Teil von <BausteinLink id={d.parent} />
        </div>
      ) : null}
      <h2 className="mt-1.5 mb-0.5 font-heading text-2xl leading-[1.1] font-bold text-balance">
        {d.name}
      </h2>
      {d.aka?.length ? (
        <div className="text-[13px] text-muted-foreground">
          auch: {d.aka.join(" · ")}
        </div>
      ) : null}
      <p className="mt-2.5 mb-3 text-[15px]">{d.kurz}</p>
      <div className="mb-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] text-muted-foreground">
        <StatusBadge status={d.status} />
        {d.statusText}
      </div>
      {text("Was es macht", d.was)}
      {text("Wie es funktioniert", d.wie)}
      {text("Bezug zu S/4HANA", d.s4)}
      {text("Wann einsetzen", d.wann)}
      {test && d.test ? (
        <section className="mt-3 rounded-lg bg-secondary px-3 py-2.5 text-secondary-foreground">
          <h4 className="mb-0.5 text-xs font-semibold tracking-wider uppercase">
            Testperspektive: was das für Test & Qualität heißt
          </h4>
          <p>{d.test}</p>
        </section>
      ) : null}
      {text("Lizenz & Paketierung", d.lizenz)}
      {dates.length ? (
        <Abschnitt titel="Daten">
          <ul className="grid gap-1">
            {dates.map((x, i) => (
              <li
                key={i}
                className="grid grid-cols-[86px_1fr] gap-2 text-[13px]"
              >
                <time className="font-mono text-xs leading-5 text-muted-foreground tabular-nums">
                  {fmtDate(x.datum)}
                </time>
                <span>{x.text}</span>
              </li>
            ))}
          </ul>
        </Abschnitt>
      ) : null}
      {kids.length ? (
        <Abschnitt titel="Einzelprodukte">
          <div className="mt-1 flex flex-wrap gap-[5px]">
            {kids.map((id) => (
              <Chip key={id} d={byId[id]!} label={byId[id]!.name} plainZone />
            ))}
          </div>
        </Abschnitt>
      ) : null}
      {rel.length ? (
        <Abschnitt titel="Hängt zusammen mit">
          <div className="mt-1 flex flex-wrap gap-[5px]">
            {rel.map((id) => (
              <Chip key={id} d={byId[id]!} label={byId[id]!.name} plainZone />
            ))}
          </div>
        </Abschnitt>
      ) : null}
      <Abschnitt
        titel={
          <>
            Quellen <BelegtBadge belegt={d.belegt} />
          </>
        }
      >
        {src.length ? (
          <ul className="mt-1 list-disc pl-[18px] text-[13px]">
            {src.map((s) => (
              <li key={s.url} className="my-0.5 break-words">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="text-link underline underline-offset-2"
                >
                  {s.titel ?? s.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            Keine verlinkbare Quelle; Angaben aus Fachwissen.
          </p>
        )}
        {d.hinweis ? (
          <div className="mt-2 border-l-[3px] border-(--st-aus) pl-2.5 text-[13px] text-muted-foreground">
            {d.hinweis}
          </div>
        ) : null}
      </Abschnitt>
    </div>
  )
}

/** Steckbrief-Fläche: mobil als Bottom-Sheet, am Desktop angedockt oder überlagernd (?steckbrief=). */
export function SteckbriefPanel() {
  const { sel, steckbrief } = useProto()
  const navigate = useNavigate()
  const mobil = useMediaQuery("(max-width: 899px)")
  const d = sel ? byId[sel] : undefined
  const clear = React.useCallback(() => {
    void navigate({
      to: ".",
      search: (prev) => ({ ...prev, b: undefined }),
      replace: true,
      resetScroll: false,
    })
  }, [navigate])

  React.useEffect(() => {
    if (!sel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [sel, clear])

  const ref = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [sel])

  if (mobil) {
    return (
      <Sheet open={!!d} onOpenChange={(o) => !o && clear()}>
        <SheetContent
          side="bottom"
          className="max-h-[80dvh] gap-0 overflow-y-auto rounded-t-xl bg-card p-4 pt-5 text-card-foreground"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Steckbrief</SheetTitle>
          <SheetDescription className="sr-only">
            {d?.name ?? ""}
          </SheetDescription>
          {d ? <SteckbriefInhalt d={d} /> : null}
        </SheetContent>
      </Sheet>
    )
  }

  const kopf = (
    <div className="mb-2 flex justify-end">
      <Button variant="outline" size="sm" onClick={clear}>
        <XIcon data-icon="inline-start" />
        Auswahl aufheben
      </Button>
    </div>
  )

  if (steckbrief === "spalte") {
    return (
      <aside
        ref={ref}
        aria-live="polite"
        aria-label="Steckbrief"
        className="sticky top-[60px] max-h-[calc(100dvh-72px)] overflow-y-auto rounded-xl border bg-card p-4.5 max-[899px]:hidden"
      >
        {d ? (
          <>
            {kopf}
            <SteckbriefInhalt d={d} />
          </>
        ) : (
          <div>
            <h2 className="font-heading text-lg font-bold">Steckbrief</h2>
            <p className="mt-1 mb-4 text-muted-foreground">
              Ein Klick auf einen Baustein öffnet hier den Steckbrief und hebt
              die verwandten Bausteine hervor.
            </p>
            <Legende className="flex-col" />
          </div>
        )}
      </aside>
    )
  }

  if (!d) return null
  return (
    <aside
      ref={ref}
      aria-live="polite"
      aria-label="Steckbrief"
      className="fixed top-0 right-0 z-40 h-dvh w-[420px] animate-in overflow-y-auto border-l bg-card p-5 shadow-2xl duration-200 slide-in-from-right-10 fade-in-0 max-[899px]:hidden"
    >
      {kopf}
      <SteckbriefInhalt d={d} />
    </aside>
  )
}
