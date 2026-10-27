import { BookOpenCheck, Flag } from "lucide-react"

import { EscalationCard } from "@/components/patient/escalation-card"
import { MascotAvatar } from "@/components/patient/mascot-avatar"
import { Button } from "@/components/ui/button"
import type { ChatMessage } from "@/features/companion/types"
import type { Doctor } from "@/features/patient/types"
import { formatDate } from "@/lib/date"
import { cn } from "@/lib/utils"

type ChatBubbleProps = {
  message: ChatMessage
  doctors: Doctor[]
  onReport: (messageId: string) => void
}

function getDoctorShortName(doctors: Doctor[], doctorId: string): string {
  const name = doctors.find((doctor) => doctor.id === doctorId)?.name ?? "dokter"
  return name.split(",")[0] ?? name
}

export function ChatBubble({ message, doctors, onReport }: ChatBubbleProps) {
  const isPatient = message.role === "patient"
  const escalationScope = !isPatient && message.scope !== "in-scope" ? message.scope : null

  return (
    <div className={cn("flex flex-col gap-2", isPatient ? "items-end" : "items-start")}>
      <div className="flex items-end gap-2">
        {isPatient ? null : <MascotAvatar className="size-9" />}
        <div
          className={cn(
            "max-w-xs sm:max-w-md rounded-2xl px-4 py-3 whitespace-pre-line",
            isPatient ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card",
          )}
        >
          {message.content}
        </div>
      </div>

      {message.source ? (
        <p className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <BookOpenCheck className="size-3.5" />
          Berdasarkan care plan v{message.source.version} · {getDoctorShortName(doctors, message.source.doctorId)} ·{" "}
          {formatDate(message.source.confirmedAt, "d MMM")}
        </p>
      ) : null}

      {escalationScope ? <EscalationCard scope={escalationScope} /> : null}

      {!isPatient ? (
        <Button
          variant="ghost"
          size="sm"
          disabled={message.isReported}
          onClick={() => onReport(message.id)}
          className="text-muted-foreground"
        >
          <Flag />
          {message.isReported ? "Sudah dilaporkan" : "Laporkan jawaban"}
        </Button>
      ) : null}
    </div>
  )
}
