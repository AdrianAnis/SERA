import { Phone, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EMERGENCY_NUMBER } from "@/features/companion/scenarios"
import type { QuestionScope } from "@/features/companion/types"
import { cn } from "@/lib/utils"

type EscalationCardProps = {
  scope: Exclude<QuestionScope, "in-scope">
}

const ESCALATION_COPY: Record<EscalationCardProps["scope"], { title: string; description: string }> = {
  urgent: {
    title: "Butuh bantuan segera",
    description: "Jangan menunggu. Hubungi layanan darurat atau datang ke IGD terdekat sekarang.",
  },
  "out-of-scope": {
    title: "Tanyakan ke dokter kamu",
    description: "Pertanyaan ini perlu dijawab langsung oleh dokter atau tenaga kesehatan di rumah sakit.",
  },
}

export function EscalationCard({ scope }: EscalationCardProps) {
  const copy = ESCALATION_COPY[scope]
  const isUrgent = scope === "urgent"

  return (
    <div
      role="alert"
      className={cn(
        "w-full max-w-xs sm:max-w-md rounded-2xl border p-4",
        isUrgent ? "border-destructive/40 bg-destructive/10" : "border-warning/40 bg-warning/15",
      )}
    >
      <p className={cn("flex items-center gap-2 font-semibold", isUrgent ? "text-destructive" : "text-warning-foreground")}>
        {isUrgent ? <Phone className="size-5" /> : <Stethoscope className="size-5" />}
        {copy.title}
      </p>
      <p className="mt-1 text-sm">{copy.description}</p>
      {isUrgent ? (
        <Button asChild variant="destructive" className="mt-3 h-11 w-full text-base">
          <a href={`tel:${EMERGENCY_NUMBER}`}>Hubungi {EMERGENCY_NUMBER}</a>
        </Button>
      ) : null}
    </div>
  )
}
