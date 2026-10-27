import Link from "next/link"
import { Check, ChevronRight, CircleAlert, Pill, Footprints } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ReminderStatus, ReminderView } from "@/features/reminder/selectors"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"

type ReminderTimelineProps = {
  reminders: ReminderView[]
  onToggle: (key: string) => void
}

const STATUS_LABEL: Record<ReminderStatus, string> = {
  done: "Selesai",
  overdue: "Terlewat",
  upcoming: "Nanti",
  anytime: "Kapan saja",
}

const STATUS_STYLE: Record<ReminderStatus, string> = {
  done: "bg-success/10 text-success",
  overdue: "bg-destructive/10 text-destructive",
  upcoming: "bg-muted text-muted-foreground",
  anytime: "bg-secondary text-secondary-foreground",
}

export function ReminderTimeline({ reminders, onToggle }: ReminderTimelineProps) {
  if (reminders.length === 0) {
    return <p className="rounded-2xl bg-muted p-4 text-muted-foreground">Belum ada jadwal untuk hari ini.</p>
  }

  return (
    <ul className="space-y-3">
      {reminders.map((reminder) => {
        const isDone = reminder.status === "done"
        const KindIcon = reminder.kind === "medication" ? Pill : Footprints
        return (
          <li
            key={reminder.key}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-card p-4",
              reminder.status === "overdue" && "border-destructive/40",
            )}
          >
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", STATUS_STYLE[reminder.status])}>
              {isDone ? <Check className="size-5" /> : reminder.status === "overdue" ? <CircleAlert className="size-5" /> : <KindIcon className="size-5" />}
            </span>
            <Link href={routes.patient.carePlanItem(reminder.itemId)} className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                {reminder.time ?? "Hari ini"} · {STATUS_LABEL[reminder.status]}
              </p>
              <p className={cn("truncate font-medium", isDone && "text-muted-foreground line-through")}>{reminder.title}</p>
              <p className="truncate type-caption">{reminder.detail}</p>
            </Link>
            <Button variant={isDone ? "ghost" : "outline"} onClick={() => onToggle(reminder.key)}>
              {isDone ? "Batalkan" : "Selesai"}
            </Button>
            <ChevronRight className="hidden size-5 text-muted-foreground sm:block" aria-hidden="true" />
          </li>
        )
      })}
    </ul>
  )
}
