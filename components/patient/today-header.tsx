import { CalendarDays } from "lucide-react"

import { InteractiveMascot } from "@/components/patient/interactive-mascot"
import { formatDate, getGreeting } from "@/lib/date"

type TodayHeaderProps = {
  now: Date
  honorific: string
  firstName: string
}

export function TodayHeader({ now, honorific, firstName }: TodayHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="min-w-0 space-y-3">
        <p className="flex items-center gap-2 type-overline">
          <CalendarDays className="size-4" />
          {formatDate(now, "EEEE, d MMMM yyyy")}
        </p>
        <h1 className="type-title">
          {getGreeting(now)}, {honorific} {firstName}
        </h1>
      </div>
      <InteractiveMascot />
    </header>
  )
}
