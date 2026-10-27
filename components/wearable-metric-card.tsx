import Link from "next/link"
import { ChevronRight, Droplets, Footprints, HeartPulse, Moon, type LucideIcon } from "lucide-react"

import { WearableChart } from "@/components/wearable-chart"
import { WEARABLE_METRIC_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import type { MetricTrend } from "@/features/wearable/types"

type WearableMetricCardProps = {
  href: string
  metric: WearableMetric
  trend: MetricTrend
}

const METRIC_ICON: Record<WearableMetric, LucideIcon> = {
  steps: Footprints,
  "heart-rate": HeartPulse,
  sleep: Moon,
  spo2: Droplets,
}

export function WearableMetricCard({ href, metric, trend }: WearableMetricCardProps) {
  const Icon = METRIC_ICON[metric]
  const { headline } = trend

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border bg-background p-4 transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          {WEARABLE_METRIC_LABEL[metric]}
        </span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
      <p className="leading-none">
        <span className="text-2xl font-semibold tabular-nums">{headline.value}</span>
        {headline.unit ? <span className="ml-1.5 text-sm text-muted-foreground">{headline.unit}</span> : null}
      </p>
      <div className="h-16" aria-hidden="true">
        <WearableChart metric={metric} period="day" points={trend.points} isCompact />
      </div>
      <p className="type-caption">{headline.label}</p>
    </Link>
  )
}
