import { Link } from "@tanstack/react-router"
import {
  DesktopIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import type { Status } from "@/data/steckbriefe"
import { byId } from "@/data/steckbriefe"
import { StatusMark } from "@/components/chip"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Theme } from "@/lib/proto"
import { useProto } from "@/lib/proto"

const FILTER: Array<{ key: string; name: string; mark?: Status }> = [
  { key: "all", name: "Alle" },
  { key: "neu", name: "Neu", mark: "neu" },
  { key: "umbenannt", name: "Umbenannt", mark: "umbenannt" },
  { key: "auslaufend", name: "Läuft aus", mark: "auslaufend" },
]

function ThemeMenu() {
  const { theme, setTheme } = useProto()
  const Icon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : DesktopIcon
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Farbmodus wählen">
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Farbmodus</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(v) => setTheme(v as Theme)}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon /> Hell
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon /> Dunkel
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <DesktopIcon /> Wie das System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Kopf() {
  const { q, setQ, status, setStatus, test, setTest } = useProto()
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-5 pb-3.5">
      <h1 className="font-heading text-[clamp(26px,3.2vw,38px)] leading-none font-bold tracking-tight">
        S/4HANA-<span className="text-link">Landkarte</span> 2026
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchen, z. B. PI/PO, Datasphere, Tosca"
            aria-label="Bausteine durchsuchen"
            className="w-[min(300px,78vw)] bg-card pl-8"
          />
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={1}
          value={status}
          onValueChange={(v) => setStatus(v || "all")}
          aria-label="Nach Status filtern"
          className="flex-wrap"
        >
          {FILTER.map((f) => (
            <ToggleGroupItem
              key={f.key}
              value={f.key}
              className="rounded-full! bg-card data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {f.mark ? <StatusMark status={f.mark} /> : null}
              {f.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2 pl-1">
          <Switch id="testperspektive" checked={test} onCheckedChange={setTest} />
          <Label htmlFor="testperspektive" className="text-[13px]">
            Testperspektive
          </Label>
        </div>
        <ThemeMenu />
      </div>
    </header>
  )
}

const tabCls =
  "border-b-[3px] border-transparent px-3.5 py-2.5 font-semibold whitespace-nowrap text-muted-foreground"

export function Ansichten() {
  const { sel } = useProto()
  const d = sel ? byId[sel] : undefined
  return (
    <div className="sticky top-0 z-30 mb-4 flex items-center gap-3 border-b bg-background">
      <nav
        aria-label="Ansichten"
        className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:thin]"
      >
        {(
          [
            ["/", "Landkarte"],
            ["/schichtenmodell", "Schichtenmodell"],
          ] as const
        ).map(([to, name]) => (
          <Link
            key={to}
            to={to}
            search={(prev) => prev}
            activeOptions={{ exact: true, includeSearch: false }}
            className={cn(tabCls, "hover:text-foreground")}
            activeProps={{
              className: "border-primary! text-foreground!",
              "aria-current": "page",
            }}
          >
            {name}
          </Link>
        ))}
        {["Integrationswege", "Toolchain", "Clean Core", "Zeitleiste"].map(
          (name) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <span
                  aria-disabled
                  tabIndex={0}
                  className={cn(tabCls, "cursor-default font-normal opacity-60")}
                >
                  {name}
                </span>
              </TooltipTrigger>
              <TooltipContent>Nicht Teil dieses Prototyps</TooltipContent>
            </Tooltip>
          )
        )}
      </nav>
      {d ? (
        <div className="flex max-w-[45%] min-w-0 items-center gap-2 rounded-full bg-foreground py-1 pr-1 pl-3 text-[13px] text-background max-[899px]:max-w-[60%]">
          <span className="opacity-70 max-[639px]:hidden">Auswahl:</span>
          <b className="min-w-0 truncate">{d.name}</b>
          <Link
            to="."
            search={(prev) => ({ ...prev, b: undefined })}
            replace
            resetScroll={false}
            aria-label="Auswahl aufheben"
            className="flex size-6 flex-none items-center justify-center rounded-full bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <XIcon weight="bold" className="size-3" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
