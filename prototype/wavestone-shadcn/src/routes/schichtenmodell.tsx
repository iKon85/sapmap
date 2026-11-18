import { createFileRoute } from "@tanstack/react-router"
import { Schichtenmodell } from "@/components/schichtenmodell"

export const Route = createFileRoute("/schichtenmodell")({
  component: SchichtenAnsicht,
})

function SchichtenAnsicht() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="font-heading text-[22px] leading-tight font-bold">
        Schichtenmodell
      </h2>
      <p className="mt-1 mb-2 max-w-[75ch] text-muted-foreground">
        Welche Kästen wie zusammengesteckt sind: unten Infrastruktur und
        Datenbank, darauf der S/4HANA-Kern mit seiner Clean-Core-Grenze, darüber
        die Integrationsschicht und die Anwendungen daneben. Querschnittlich
        Security, daneben die Projektwerkzeuge. Jeder Baustein ist anklickbar.
      </p>
      <Schichtenmodell />
    </div>
  )
}
