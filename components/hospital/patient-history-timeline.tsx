import { HEALTH_HISTORY_TYPE_LABEL } from "@/features/patient/labels"
import type { HealthHistoryEntry } from "@/features/patient/types"
import { formatDate } from "@/lib/date"

type PatientHistoryTimelineProps = {
  entries: HealthHistoryEntry[]
}

export function PatientHistoryTimeline({ entries }: PatientHistoryTimelineProps) {
  if (entries.length === 0) return <p className="type-caption">Belum ada riwayat.</p>

  return (
    <ol className="space-y-5 border-l pl-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute top-1.5 -left-[1.6rem] size-2.5 rounded-full border-2 border-card bg-primary" aria-hidden="true" />
          <p className="type-overline">
            {HEALTH_HISTORY_TYPE_LABEL[entry.type]} · {formatDate(entry.date)}
          </p>
          <p className="mt-1.5 text-sm font-medium">{entry.title}</p>
          {entry.value ? <p className="text-sm font-semibold text-primary">{entry.value}</p> : null}
          <p className="type-caption">{entry.notes}</p>
        </li>
      ))}
    </ol>
  )
}
