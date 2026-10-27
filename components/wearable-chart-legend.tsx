import { SLEEP_STAGE_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import type { WearablePeriod } from "@/features/wearable/types"

type WearableChartLegendProps = {
  metric: WearableMetric
  period: WearablePeriod
}

type LegendItem = {
  label: string
  swatchClass: string
}

const SPO2_LEGEND: LegendItem[] = [
  { label: "< 70%", swatchClass: "bg-destructive" },
  { label: "70%–89%", swatchClass: "bg-warning" },
  { label: "90%–100%", swatchClass: "bg-success" },
]

const SLEEP_LEGEND: LegendItem[] = [
  { label: SLEEP_STAGE_LABEL.deep, swatchClass: "bg-chart-1" },
  { label: SLEEP_STAGE_LABEL.light, swatchClass: "bg-chart-2" },
  { label: SLEEP_STAGE_LABEL.rem, swatchClass: "bg-chart-3" },
  { label: SLEEP_STAGE_LABEL.awake, swatchClass: "bg-warning" },
]

function selectLegend(metric: WearableMetric, period: WearablePeriod): LegendItem[] {
  if (metric === "spo2") return SPO2_LEGEND
  return metric === "sleep" && period === "day" ? SLEEP_LEGEND : []
}

export function WearableChartLegend({ metric, period }: WearableChartLegendProps) {
  const items = selectLegend(metric, period)
  if (items.length === 0) return null

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${item.swatchClass}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
