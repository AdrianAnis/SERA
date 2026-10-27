import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WEEKDAY_DISPLAY_ORDER, WEEKDAY_SHORT_LABEL } from "@/features/consultation/labels"
import { selectConsultationsOnDate, selectMonthGridDays } from "@/features/consultation/selectors"
import type { Consultation, ConsultationStatus, Weekday } from "@/features/consultation/types"
import { formatDate, getWeekday, toDateKey, toTimeKey } from "@/lib/date"
import { cn } from "@/lib/utils"

const VISIBLE_CHIPS = 2

const CHIP_CLASS: Record<ConsultationStatus, string> = {
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/10 text-destructive line-through",
}

type ConsultationCalendarProps = {
  month: Date
  today: Date
  consultations: Consultation[]
  patientNames: Record<string, string>
  inactiveWeekdays: Weekday[]
  selectedDateKey: string
  onSelectDate: (dateKey: string) => void
  onShiftMonth: (delta: number) => void
  onGoToToday: () => void
}

type CalendarDayCellProps = {
  day: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isInactive: boolean
  consultations: Consultation[]
  patientNames: Record<string, string>
  onSelect: (dateKey: string) => void
}

function CalendarDayCell({ day, isCurrentMonth, isToday, isSelected, isInactive, consultations, patientNames, onSelect }: CalendarDayCellProps) {
  const hiddenCount = consultations.length - VISIBLE_CHIPS

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${formatDate(day, "d MMMM yyyy")}, ${consultations.length} konsultasi`}
      onClick={() => onSelect(toDateKey(day))}
      className={cn(
        "flex min-h-24 flex-col gap-1 border-r border-b p-1.5 text-left align-top transition-colors hover:bg-muted/60 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isInactive && "bg-muted/40",
        !isCurrentMonth && "text-muted-foreground/50",
        isSelected && "bg-primary/5 ring-2 ring-primary ring-inset",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs font-medium",
          isToday && "bg-primary text-primary-foreground",
        )}
      >
        {formatDate(day, "d")}
      </span>
      {consultations.slice(0, VISIBLE_CHIPS).map((consultation) => (
        <span key={consultation.id} className={cn("truncate rounded px-1.5 py-0.5 text-[11px] leading-tight font-medium", CHIP_CLASS[consultation.status])}>
          {toTimeKey(consultation.startsAt)} {(patientNames[consultation.patientId] ?? "").split(" ")[0]}
        </span>
      ))}
      {hiddenCount > 0 ? <span className="px-1.5 text-[11px] text-muted-foreground">+{hiddenCount} lagi</span> : null}
    </button>
  )
}

export function ConsultationCalendar({
  month,
  today,
  consultations,
  patientNames,
  inactiveWeekdays,
  selectedDateKey,
  onSelectDate,
  onShiftMonth,
  onGoToToday,
}: ConsultationCalendarProps) {
  const todayKey = toDateKey(today)

  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="type-subheading">{formatDate(month, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onGoToToday}>
            Hari ini
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Bulan sebelumnya" onClick={() => onShiftMonth(-1)}>
            <ChevronLeft />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Bulan berikutnya" onClick={() => onShiftMonth(1)}>
            <ChevronRight />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {WEEKDAY_DISPLAY_ORDER.map((weekday) => (
          <span key={weekday} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAY_SHORT_LABEL[weekday]}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 [&>button:nth-child(7n)]:border-r-0 [&>button:nth-last-child(-n+7)]:border-b-0">
        {selectMonthGridDays(month).map((day) => {
          const dateKey = toDateKey(day)
          return (
            <CalendarDayCell
              key={dateKey}
              day={day}
              isCurrentMonth={day.getMonth() === month.getMonth()}
              isToday={dateKey === todayKey}
              isSelected={dateKey === selectedDateKey}
              isInactive={inactiveWeekdays.includes(getWeekday(day) as Weekday)}
              consultations={selectConsultationsOnDate(consultations, dateKey)}
              patientNames={patientNames}
              onSelect={onSelectDate}
            />
          )
        })}
      </div>
    </section>
  )
}
