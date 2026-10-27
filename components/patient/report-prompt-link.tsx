import Link from "next/link"
import { ChevronRight, MessageSquareWarning } from "lucide-react"

import { routes } from "@/lib/routes"

export function ReportPromptLink() {
  return (
    <Link
      href={routes.patient.companion}
      className="flex min-h-20 items-center gap-4 rounded-2xl border bg-card px-5 py-5 transition-colors hover:bg-muted"
    >
      <MessageSquareWarning className="size-5 shrink-0 text-primary" />
      <span className="flex-1">
        <span className="block font-medium">Ada keluhan atau kendala?</span>
        <span className="block type-caption">Ceritakan ke Companion. Companion juga bisa membantu mengajukan jadwal konsultasi.</span>
      </span>
      <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
    </Link>
  )
}
