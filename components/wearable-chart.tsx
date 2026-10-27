"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { formatDuration, formatNumber } from "@/features/wearable/format"
import type { WearableMetric } from "@/features/wearable/schema"
import type { TrendPoint, WearablePeriod } from "@/features/wearable/types"

type WearableChartProps = {
  metric: WearableMetric
  period: WearablePeriod
  points: TrendPoint[]
  isCompact?: boolean
}

type ChartDatum = TrendPoint & { range: [number, number] | null }

type WearableTooltipProps = {
  active?: boolean
  payload?: { payload: ChartDatum }[]
  metric: WearableMetric
}

const SLEEP_STAGE_COLOR: Record<string, string> = {
  deep: "var(--chart-1)",
  light: "var(--chart-2)",
  rem: "var(--chart-3)",
  awake: "var(--warning)",
}

const SPO2_LOW_LIMIT = 70
const SPO2_MEDIUM_LIMIT = 90
const MINUTES_PER_HOUR = 60
const SPO2_TICKS = [85, 90, 95, 100]

function selectSpo2Color(value: number | null): string {
  if (value === null) return "var(--muted)"
  if (value < SPO2_LOW_LIMIT) return "var(--destructive)"
  return value < SPO2_MEDIUM_LIMIT ? "var(--warning)" : "var(--success)"
}

function describePoint(metric: WearableMetric, point: ChartDatum): string {
  if (point.value === null) return "-"
  switch (metric) {
    case "steps":
      return `${formatNumber(point.value)} langkah`
    case "heart-rate":
      return point.range ? `${point.range[0]}–${point.range[1]} bpm` : `${point.value} bpm`
    case "sleep":
      return formatDuration(point.value)
    case "spo2":
      return point.range ? `${point.range[0]}–${point.range[1]}%` : `${point.value}%`
  }
}

function WearableTooltip({ active, payload, metric }: WearableTooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="font-semibold">{point.label}</p>
      <p>{describePoint(metric, point)}</p>
    </div>
  )
}

function selectCellFill(metric: WearableMetric, period: WearablePeriod, point: ChartDatum): string | undefined {
  if (metric === "spo2") return selectSpo2Color(point.value)
  if (metric === "sleep" && period === "day") return SLEEP_STAGE_COLOR[point.key]
  return undefined
}

function selectYTickFormatter(metric: WearableMetric): ((value: number) => string) | undefined {
  if (metric === "sleep") return (minutes) => `${Math.round(minutes / MINUTES_PER_HOUR)} j`
  return metric === "steps" ? formatNumber : undefined
}

function selectYDomain(metric: WearableMetric, period: WearablePeriod): [number, number | "auto"] {
  if (metric === "spo2") return [85, 100]
  if (metric === "heart-rate") return [40, period === "day" ? "auto" : 200]
  return [0, "auto"]
}

function selectXInterval(metric: WearableMetric, period: WearablePeriod): number {
  if (period === "month") return 4
  return period === "day" && (metric === "steps" || metric === "heart-rate") ? 5 : 0
}

export function WearableChart({ metric, period, points, isCompact = false }: WearableChartProps) {
  const data: ChartDatum[] = points.map((point) => ({ ...point, range: point.low !== null && point.high !== null ? [point.low, point.high] : null }))
  const isRange = period !== "day" && (metric === "heart-rate" || metric === "spo2")
  const margin = isCompact ? { top: 4, right: 0, bottom: 0, left: 0 } : { top: 8, right: 8, bottom: 0, left: -8 }

  const axes = isCompact ? null : (
    <>
      <CartesianGrid vertical={false} stroke="var(--border)" />
      <XAxis dataKey="label" tickLine={false} axisLine={false} interval={selectXInterval(metric, period)} tickMargin={8} stroke="var(--muted-foreground)" />
      <YAxis
        domain={selectYDomain(metric, period)}
        ticks={metric === "spo2" ? SPO2_TICKS : undefined}
        tickLine={false}
        axisLine={false}
        stroke="var(--muted-foreground)"
        tickFormatter={selectYTickFormatter(metric)}
      />
      <Tooltip content={<WearableTooltip metric={metric} />} cursor={{ fill: "var(--muted)" }} />
    </>
  )

  if (metric === "heart-rate" && period === "day") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id="heart-rate-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {axes}
          <Area type="monotone" dataKey="value" stroke="var(--destructive)" strokeWidth={2} fill="url(#heart-rate-fill)" dot={false} connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={margin} barCategoryGap={isRange ? "30%" : "20%"}>
        {axes}
        <Bar dataKey={isRange ? "range" : "value"} radius={4} fill={metric === "heart-rate" ? "var(--destructive)" : "var(--chart-1)"}>
          {data.map((point) => {
            const fill = selectCellFill(metric, period, point)
            return fill ? <Cell key={point.key} fill={fill} /> : null
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
