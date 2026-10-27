import { CalendarCheck } from "lucide-react"

import type { FollowUpItem } from "@/features/care-plan/types"
import type { Doctor } from "@/features/patient/types"
import { daysBetween, formatDate } from "@/lib/date"

type FollowUpCardProps = {
  followUp: FollowUpItem | undefined
  doctor: Doctor | undefined
  now: Date
}

function describeCountdown(days: number): string {
  if (days <= 0) return "Hari ini"
  if (days === 1) return "Besok"
  return `${days} hari lagi`
}

export function FollowUpCard({ followUp, doctor, now }: FollowUpCardProps) {
  return (
    <section className="rounded-3xl border border-primary/25 bg-primary/10 p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CalendarCheck className="size-5" />
        </span>
        <h2 className="type-subheading">Kontrol berikutnya</h2>
      </div>
      {followUp ? (
        <div className="mt-5 flex items-center gap-4">
          <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-card text-primary">
            <span className="text-xs leading-none font-medium uppercase">{formatDate(followUp.date, "MMM")}</span>
            <span className="mt-1 text-2xl leading-none font-semibold">{formatDate(followUp.date, "d")}</span>
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="font-semibold text-primary">{describeCountdown(daysBetween(now, followUp.date))}</p>
            <p className="font-medium">{formatDate(followUp.date, "EEEE, d MMMM yyyy")}</p>
            <p className="type-caption">{followUp.instruction}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 type-caption">Belum ada jadwal kontrol di care plan kamu.</p>
      )}
      {followUp && doctor ? (
        <p className="mt-4 border-t border-primary/20 pt-4 text-sm text-muted-foreground">
          {doctor.name} · {doctor.hospital}
        </p>
      ) : null}
    </section>
  )
}
