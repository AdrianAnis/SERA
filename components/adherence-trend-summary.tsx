import { REMINDER_KIND_LABEL } from "@/features/reminder/labels"
import type { AdherenceTrendSummary } from "@/features/reminder/selectors"
import { formatDate } from "@/lib/date"

type AdherenceTrendSummaryCardsProps = {
  summary: AdherenceTrendSummary
}

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${value}%`
}

export function AdherenceTrendSummaryCards({ summary }: AdherenceTrendSummaryCardsProps) {
  const { medicationAverage, activityAverage, lowest } = summary

  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-muted/50 p-4">
        <dt className="type-caption">Rata-rata kepatuhan obat</dt>
        <dd className="mt-1 text-2xl leading-none font-semibold tabular-nums">{formatPercent(medicationAverage)}</dd>
      </div>
      <div className="rounded-xl bg-muted/50 p-4">
        <dt className="type-caption">Rata-rata kepatuhan aktivitas</dt>
        <dd className="mt-1 text-2xl leading-none font-semibold tabular-nums">{formatPercent(activityAverage)}</dd>
      </div>
      <div className="rounded-xl bg-muted/50 p-4">
        <dt className="type-caption">Capaian terendah</dt>
        <dd className="mt-1 text-sm font-semibold">
          {lowest ? `${REMINDER_KIND_LABEL[lowest.kind]} ${lowest.percent}% · ${formatDate(lowest.date, "EEEE, d MMM")}` : "-"}
        </dd>
      </div>
    </dl>
  )
}
