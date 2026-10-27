"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { AdherenceTrendPoint } from "@/features/reminder/selectors"
import { formatDate } from "@/lib/date"

type AdherenceLineChartProps = {
  points: AdherenceTrendPoint[]
}

type AdherenceTooltipProps = {
  active?: boolean
  payload?: { payload: AdherenceTrendPoint }[]
}

const PERCENT_TICKS = [0, 25, 50, 75, 100]

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${value}%`
}

function AdherenceTooltip({ active, payload }: AdherenceTooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="font-semibold">{formatDate(point.date, "EEEE, d MMM")}</p>
      <p>Obat: {formatPercent(point.medication)}</p>
      <p>Aktivitas: {formatPercent(point.activity)}</p>
    </div>
  )
}

export function AdherenceLineChart({ points }: AdherenceLineChartProps) {
  const data = points.map((point) => ({ ...point, label: formatDate(point.date, "EEE") }))

  return (
    <div className="space-y-3">
      <div className="h-64 w-full" role="img" aria-label="Grafik garis tingkat kepatuhan obat dan aktivitas selama 7 hari terakhir, skala 0 sampai 100 persen">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} padding={{ left: 16, right: 16 }} tickMargin={8} stroke="var(--muted-foreground)" />
            <YAxis
              domain={[0, 100]}
              padding={{ top: 8, bottom: 8 }}
              ticks={PERCENT_TICKS}
              tickFormatter={(value: number) => `${value}%`}
              tickLine={false}
              axisLine={false}
              stroke="var(--muted-foreground)"
            />
            <Tooltip content={<AdherenceTooltip />} cursor={{ stroke: "var(--border)" }} />
            <Line type="monotone" dataKey="medication" name="Obat" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            <Line
              type="monotone"
              dataKey="activity"
              name="Aktivitas"
              stroke="var(--chart-2)"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-chart-1" aria-hidden="true" />
          Obat
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-chart-2" aria-hidden="true" />
          Aktivitas
        </li>
      </ul>
    </div>
  )
}
