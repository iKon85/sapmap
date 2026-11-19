// PROTOTYP zu „Trägt der Wavestone-Look auf shadcn?“ (iKon85/sapmap#31).
// Drei Layouts der Landkarte, drei Farbschemata, zwei Steckbrief-Modi, umschaltbar über ?layout= ?farben= ?steckbrief=.
import * as React from "react"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router"
import { cn } from "cn"

import appCss from "../styles.css?url"
import type { Proto, Theme } from "@/lib/proto"
import { ProtoContext, validateProtoSearch } from "@/lib/proto"
import { Ansichten, Kopf } from "@/components/seitenrahmen"
import { SteckbriefPanel } from "@/components/steckbrief"
import { PrototypeSwitcher } from "@/components/prototype-switcher"
import { TooltipProvider } from "@/components/ui/tooltip"

// Farbmodus vor dem ersten Zeichnen setzen, damit nichts aufblitzt
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme")||"system";if(t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`

export const Route = createRootRoute({
  validateSearch: validateProtoSearch,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "S/4HANA-Landkarte 2026 (Prototyp)" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="p-4 pt-16">
      <h1>Seite nicht gefunden</h1>
    </main>
  ),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // data-farben am <html>, damit auch Portale (Sheet, Menü) die Bereichsfarben erben
  const farben = useRouterState({
    select: (s) => validateProtoSearch(s.location.search).farben ?? "tonstufen",
  })
  const kante = useRouterState({
    select: (s) => validateProtoSearch(s.location.search).kante ?? "oben",
  })
  return (
    <html lang="de" data-farben={farben} data-kante={kante} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const search = Route.useSearch()
  const [q, setQ] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [test, setTest] = React.useState(false)
  const [theme, setThemeState] = React.useState<Theme>("system")

  React.useEffect(() => {
    const t = localStorage.getItem("theme")
    if (t === "light" || t === "dark") setThemeState(t)
  }, [])
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () =>
      document.documentElement.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && m.matches)
      )
    apply()
    m.addEventListener("change", apply)
    return () => m.removeEventListener("change", apply)
  }, [theme])
  const setTheme = React.useCallback((t: Theme) => {
    localStorage.setItem("theme", t)
    setThemeState(t)
  }, [])

  const proto: Proto = {
    sel: search.b,
    layout: search.layout ?? "a",
    farben: search.farben ?? "tonstufen",
    steckbrief: search.steckbrief ?? "overlay",
    kante: search.kante ?? "oben",
    q,
    setQ,
    status,
    setStatus,
    test,
    setTest,
    theme,
    setTheme,
  }
  const angedockt = proto.steckbrief === "spalte"

  return (
    <ProtoContext.Provider value={proto}>
      <TooltipProvider>
        <div className="mx-auto max-w-[1680px] px-4 pb-24">
          <Kopf />
          <Ansichten />
          <div
            className={cn(
              angedockt &&
                "grid items-start gap-5 min-[900px]:grid-cols-[minmax(0,1fr)_340px] min-[1180px]:grid-cols-[minmax(0,1fr)_400px]"
            )}
          >
            <main className="min-w-0">
              <Outlet />
            </main>
            <SteckbriefPanel />
          </div>
        </div>
        <PrototypeSwitcher />
      </TooltipProvider>
    </ProtoContext.Provider>
  )
}
