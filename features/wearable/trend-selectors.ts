import { addDays, addYears, eachDayOfInterval, endOfMonth, startOfMonth, subMonths } from "date-fns"

import { SLEEP_STAGE_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import { formatDuration, formatNumber } from "@/features/wearable/format"
import type { DailyReadings, MetricStat, MetricTrend, TrendPoint, WearablePeriod } from "@/features/wearable/types"
import { formatDate, toDate, toDateKey } from "@/lib/date"
import { buildDailyReadings } from "@/mocks/wearable"

type RangePeriod = Exclude<WearablePeriod, "day">

type Bucket = {
  key: string
  label: string
  readings: DailyReadings[]
}

type BucketValues = Pick<TrendPoint, "value" | "low" | "high">

const RANGE_DAY_COUNT: Record<Exclude<RangePeriod, "year">, number> = { week: 7, month: 30 }

const MONTHS_IN_YEAR = 12

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length
}

function stat(key: string, label: string, value: string, unit: string): MetricStat {
  return { key, label, value, unit }
}

function buildBuckets(patientId: string, period: RangePeriod, anchorKey: string): Bucket[] {
  const anchor = toDate(anchorKey)
  if (period === "year") {
    return Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
      const monthStart = startOfMonth(subMonths(anchor, MONTHS_IN_YEAR - 1 - index))
      const monthEnd = index === MONTHS_IN_YEAR - 1 ? anchor : endOfMonth(monthStart)
      const readings = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((day) => buildDailyReadings(patientId, toDateKey(day)))
      return { key: toDateKey(monthStart), label: formatDate(monthStart, "MMM"), readings }
    })
  }
  const dayCount = RANGE_DAY_COUNT[period]
  return Array.from({ length: dayCount }, (_, index) => {
    const day = addDays(anchor, index - (dayCount - 1))
    const dateKey = toDateKey(day)
    return { key: dateKey, label: formatDate(day, period === "week" ? "EEE" : "d"), readings: [buildDailyReadings(patientId, dateKey)] }
  })
}

const BUCKET_VALUES: Record<WearableMetric, (readings: DailyReadings[]) => BucketValues> = {
  steps: (readings) => ({ value: Math.round(mean(readings.map((reading) => reading.steps.total))), low: null, high: null }),
  "heart-rate": (readings) => ({
    value: Math.round(mean(readings.map((reading) => reading.heartRate.resting))),
    low: Math.min(...readings.map((reading) => reading.heartRate.min)),
    high: Math.max(...readings.map((reading) => reading.heartRate.max)),
  }),
  sleep: (readings) => ({ value: Math.round(mean(readings.map((reading) => reading.sleep.totalMinutes))), low: null, high: null }),
  spo2: (readings) => ({
    value: Math.round(mean(readings.map((reading) => reading.spo2.average))),
    low: Math.min(...readings.map((reading) => reading.spo2.min)),
    high: Math.max(...readings.map((reading) => reading.spo2.max)),
  }),
}

function buildRangeStats(metric: WearableMetric, readings: DailyReadings[]): Pick<MetricTrend, "headline" | "stats"> {
  switch (metric) {
    case "steps": {
      const average = stat("average", "Rata-rata harian", formatNumber(Math.round(mean(readings.map((reading) => reading.steps.total)))), "langkah")
      return { headline: average, stats: [average, stat("total", "Total langkah", formatNumber(sum(readings.map((reading) => reading.steps.total))), "langkah")] }
    }
    case "heart-rate": {
      const range = stat("range", "Rentang denyut jantung", `${Math.min(...readings.map((reading) => reading.heartRate.min))}–${Math.max(...readings.map((reading) => reading.heartRate.max))}`, "bpm")
      return { headline: range, stats: [range, stat("resting", "Denyut jantung istirahat", String(Math.round(mean(readings.map((reading) => reading.heartRate.resting)))), "bpm")] }
    }
    case "sleep": {
      const average = stat("average", "Rata-rata tidur malam", formatDuration(Math.round(mean(readings.map((reading) => reading.sleep.totalMinutes)))), "")
      return { headline: average, stats: [average, stat("nap", "Rata-rata tidur siang", formatDuration(Math.round(mean(readings.map((reading) => reading.sleep.napMinutes)))), "")] }
    }
    case "spo2": {
      const average = stat("average", "Rata-rata SpO₂", String(Math.round(mean(readings.map((reading) => reading.spo2.average)))), "%")
      return { headline: average, stats: [average, stat("range", "Rentang SpO₂", `${Math.min(...readings.map((reading) => reading.spo2.min))}–${Math.max(...readings.map((reading) => reading.spo2.max))}`, "%")] }
    }
  }
}

function hourPoints(values: number[], lastHour: number): TrendPoint[] {
  return values.map((value, hour) => ({ key: String(hour), label: String(hour).padStart(2, "0"), value: hour <= lastHour ? value : null, low: null, high: null }))
}

function buildDayTrend(metric: WearableMetric, reading: DailyReadings, lastHour: number): MetricTrend {
  switch (metric) {
    case "steps": {
      const total = sum(reading.steps.hourly.slice(0, lastHour + 1))
      const headline = stat("total", "Langkah", formatNumber(total), "langkah")
      return { points: hourPoints(reading.steps.hourly, lastHour), headline, stats: [headline] }
    }
    case "heart-rate": {
      const latest = reading.heartRate.hourly[lastHour] ?? reading.heartRate.resting
      const headline = stat("latest", "Terakhir diperbarui", String(latest), "bpm")
      return {
        points: hourPoints(reading.heartRate.hourly, lastHour),
        headline,
        stats: [stat("range", "Rentang denyut jantung", `${reading.heartRate.min}–${reading.heartRate.max}`, "bpm"), headline, stat("resting", "Denyut jantung istirahat", String(reading.heartRate.resting), "bpm")],
      }
    }
    case "sleep": {
      const headline = stat("total", "Tidur malam", formatDuration(reading.sleep.totalMinutes), "")
      const nap = reading.sleep.napMinutes > 0 ? [stat("nap", "Tidur siang", formatDuration(reading.sleep.napMinutes), "")] : []
      return {
        points: (Object.keys(SLEEP_STAGE_LABEL) as (keyof typeof SLEEP_STAGE_LABEL)[]).map((stage) => ({
          key: stage,
          label: SLEEP_STAGE_LABEL[stage],
          value: reading.sleep.stages[stage],
          low: null,
          high: null,
        })),
        headline,
        stats: [headline, stat("schedule", "Waktu tidur", `${reading.sleep.bedtime}–${reading.sleep.wakeTime}`, ""), ...nap],
      }
    }
    case "spo2": {
      const headline = stat("average", "Rata-rata SpO₂", String(reading.spo2.average), "%")
      return {
        points: reading.spo2.readings.map((item) => ({ key: item.time, label: item.time, value: item.value, low: null, high: null })),
        headline,
        stats: [headline, stat("range", "Rentang SpO₂", `${reading.spo2.min}–${reading.spo2.max}`, "%")],
      }
    }
  }
}

export function selectMetricTrend(patientId: string, metric: WearableMetric, period: WearablePeriod, anchorKey: string, now: Date): MetricTrend {
  if (period === "day") {
    const lastHour = anchorKey === toDateKey(now) ? now.getHours() : 23
    return buildDayTrend(metric, buildDailyReadings(patientId, anchorKey), lastHour)
  }
  const buckets = buildBuckets(patientId, period, anchorKey)
  return {
    points: buckets.map((bucket) => ({ key: bucket.key, label: bucket.label, ...BUCKET_VALUES[metric](bucket.readings) })),
    ...buildRangeStats(metric, buckets.flatMap((bucket) => bucket.readings)),
  }
}

export function selectPeriodLabel(period: WearablePeriod, anchorKey: string): string {
  const anchor = toDate(anchorKey)
  switch (period) {
    case "day":
      return formatDate(anchor, "d MMM yyyy")
    case "week":
      return `${formatDate(addDays(anchor, -6), "d MMM")} – ${formatDate(anchor, "d MMM yyyy")}`
    case "month":
      return `${formatDate(addDays(anchor, -29), "d MMM")} – ${formatDate(anchor, "d MMM yyyy")}`
    case "year":
      return `${formatDate(startOfMonth(subMonths(anchor, MONTHS_IN_YEAR - 1)), "MMM yyyy")} – ${formatDate(anchor, "MMM yyyy")}`
  }
}

export function selectShiftedAnchor(period: WearablePeriod, anchorKey: string, direction: -1 | 1, todayKey: string): string {
  const anchor = toDate(anchorKey)
  const shifted = {
    day: addDays(anchor, direction),
    week: addDays(anchor, 7 * direction),
    month: addDays(anchor, 30 * direction),
    year: addYears(anchor, direction),
  }[period]
  const shiftedKey = toDateKey(shifted)
  return shiftedKey > todayKey ? todayKey : shiftedKey
}
