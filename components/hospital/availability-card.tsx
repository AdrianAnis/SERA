import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { WEEKDAY_LABEL } from "@/features/consultation/labels"
import type { AvailabilityDay, AvailabilityTimeField } from "@/features/consultation/types"
import { cn } from "@/lib/utils"

type AvailabilityCardProps = {
  days: AvailabilityDay[]
  onToggle: (availabilityId: string, isActive: boolean) => void
  onTimeChange: (availabilityId: string, field: AvailabilityTimeField, value: string) => void
}

export function AvailabilityCard({ days, onToggle, onTimeChange }: AvailabilityCardProps) {
  return (
    <section className="rounded-2xl border bg-card">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">Jam konsultasi Anda</h2>
        <p className="type-caption">Atur hari dan jam yang bisa Anda layani untuk konsultasi.</p>
      </header>
      <ul className="divide-y">
        {days.map((day) => {
          const label = WEEKDAY_LABEL[day.weekday]
          return (
            <li key={day.id} className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                <Switch id={`availability-${day.id}`} checked={day.isActive} onCheckedChange={(isActive) => onToggle(day.id, isActive)} />
                <Label htmlFor={`availability-${day.id}`} className={cn("w-14 text-sm font-medium", !day.isActive && "text-muted-foreground")}>
                  {label}
                </Label>
              </div>
              {day.isActive ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={day.startTime}
                    aria-label={`Jam mulai ${label}`}
                    onChange={(event) => onTimeChange(day.id, "startTime", event.target.value)}
                    className="w-32 bg-card"
                  />
                  <span className="text-muted-foreground" aria-hidden="true">
                    -
                  </span>
                  <Input
                    type="time"
                    value={day.endTime}
                    aria-label={`Jam selesai ${label}`}
                    onChange={(event) => onTimeChange(day.id, "endTime", event.target.value)}
                    className="w-32 bg-card"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Tidak menerima konsultasi</span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
