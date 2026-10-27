"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { WearableChart } from "@/components/wearable-chart"
import { WearableChartLegend } from "@/components/wearable-chart-legend"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WEARABLE_METRIC_LABEL, WEARABLE_PERIOD_LABEL, WEARABLE_PERIOD_ORDER } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import { selectMetricTrend, selectPeriodLabel, selectShiftedAnchor } from "@/features/wearable/trend-selectors"
import type { WearablePeriod } from "@/features/wearable/types"
import { toDateKey } from "@/lib/date"
import { useNow } from "@/lib/use-now"

type WearablePeriodExplorerProps = {
  patientId: string
  metric: WearableMetric
}

function isWearablePeriod(value: string): value is WearablePeriod {
  return WEARABLE_PERIOD_ORDER.some((period) => period === value)
}

export function WearablePeriodExplorer({ patientId, metric }: WearablePeriodExplorerProps) {
  const now = useNow()
  const [period, setPeriod] = useState<WearablePeriod>("day")
  const [anchorKey, setAnchorKey] = useState(() => toDateKey(new Date()))
  const todayKey = toDateKey(now)
  const trend = selectMetricTrend(patientId, metric, period, anchorKey, now)

  return (
    <div className="space-y-5 p-5">
      <Tabs value={period} onValueChange={(value) => isWearablePeriod(value) && setPeriod(value)}>
        <TabsList className="w-full sm:w-fit">
          {WEARABLE_PERIOD_ORDER.map((item) => (
            <TabsTrigger key={item} value={item}>
              {WEARABLE_PERIOD_LABEL[item]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="icon" aria-label="Periode sebelumnya" onClick={() => setAnchorKey(selectShiftedAnchor(period, anchorKey, -1, todayKey))}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium" aria-live="polite">
          {selectPeriodLabel(period, anchorKey)}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Periode berikutnya"
          disabled={anchorKey >= todayKey}
          onClick={() => setAnchorKey(selectShiftedAnchor(period, anchorKey, 1, todayKey))}
        >
          <ChevronRight />
        </Button>
      </div>

      <dl className="flex flex-wrap gap-x-10 gap-y-3">
        {trend.stats.map((item) => (
          <div key={item.key}>
            <dd className="leading-none">
              <span className="text-3xl font-semibold tabular-nums">{item.value}</span>
              {item.unit ? <span className="ml-1.5 text-sm text-muted-foreground">{item.unit}</span> : null}
            </dd>
            <dt className="mt-1.5 type-caption">{item.label}</dt>
          </div>
        ))}
      </dl>

      <div className="h-72 w-full" role="img" aria-label={`Grafik ${WEARABLE_METRIC_LABEL[metric]} periode ${WEARABLE_PERIOD_LABEL[period].toLowerCase()}`}>
        <WearableChart metric={metric} period={period} points={trend.points} />
      </div>
      <WearableChartLegend metric={metric} period={period} />
    </div>
  )
}
