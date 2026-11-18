import { createFileRoute } from "@tanstack/react-router"
import { Landkarte, Legende } from "@/components/landkarte"
import { useProto } from "@/lib/proto"

export const Route = createFileRoute("/")({ component: KartenAnsicht })

function KartenAnsicht() {
  const { steckbrief } = useProto()
  return (
    <>
      <Landkarte />
      {/* Angedockt steht die Legende im leeren Steckbrief-Feld, sonst wie heute unter der Karte */}
      <Legende
        className={steckbrief === "spalte" ? "mt-3 min-[900px]:hidden" : "mt-3"}
      />
    </>
  )
}
