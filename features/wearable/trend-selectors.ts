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
      const avg = Math.round(mean(readings.map((reading) => reading.steps.total)))
      const totalSteps = sum(readings.map((reading) => reading.steps.total))
      const average = stat("average", "Rata-rata harian", avg > 0 ? formatNumber(avg) : "0", "langkah")
      return { headline: average, stats: [average, stat("total", "Total langkah", totalSteps > 0 ? formatNumber(totalSteps) : "0", "langkah")] }
    }
    case "heart-rate": {
      const validReadings = readings.filter((r) => r.heartRate.resting > 0)
      const hasData = validReadings.length > 0
      const range = hasData
        ? stat("range", "Rentang denyut jantung", `${Math.min(...validReadings.map((r) => r.heartRate.min))}–${Math.max(...validReadings.map((r) => r.heartRate.max))}`, "bpm")
        : stat("range", "Rentang denyut jantung", "-", "bpm")
      const resting = stat("resting", "Denyut jantung istirahat", hasData ? String(Math.round(mean(validReadings.map((r) => r.heartRate.resting)))) : "-", "bpm")
      return { headline: range, stats: [range, resting] }
    }
    case "sleep": {
      const totalSleep = Math.round(mean(readings.map((reading) => reading.sleep.totalMinutes)))
      const napSleep = Math.round(mean(readings.map((reading) => reading.sleep.napMinutes)))
      const average = stat("average", "Rata-rata tidur malam", totalSleep > 0 ? formatDuration(totalSleep) : "0 mnt", "")
      return { headline: average, stats: [average, stat("nap", "Rata-rata tidur siang", napSleep > 0 ? formatDuration(napSleep) : "0 mnt", "")] }
    }
    case "spo2": {
      const validSpo2 = readings.filter((r) => r.spo2.average > 0)
      const hasData = validSpo2.length > 0
      const average = stat("average", "Rata-rata SpO₂", hasData ? String(Math.round(mean(validSpo2.map((r) => r.spo2.average)))) : "-", "%")
      const range = hasData
        ? stat("range", "Rentang SpO₂", `${Math.min(...validSpo2.map((r) => r.spo2.min))}–${Math.max(...validSpo2.map((r) => r.spo2.max))}`, "%")
        : stat("range", "Rentang SpO₂", "-", "%")
      return { headline: average, stats: [average, range] }
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
      const headline = stat("total", "Langkah", total > 0 ? formatNumber(total) : "0", "langkah")
      return { points: hourPoints(reading.steps.hourly, lastHour), headline, stats: [headline] }
    }
    case "heart-rate": {
      const hasData = reading.heartRate.resting > 0 || reading.heartRate.hourly.some((v) => v > 0)
      const latest = reading.heartRate.hourly[lastHour] ?? reading.heartRate.resting
      const headline = stat("latest", "Terakhir diperbarui", hasData && latest > 0 ? String(latest) : "-", "bpm")
      return {
        points: hourPoints(reading.heartRate.hourly, lastHour),
        headline,
        stats: [
          stat("range", "Rentang denyut jantung", hasData ? `${reading.heartRate.min}–${reading.heartRate.max}` : "-", "bpm"),
          headline,
          stat("resting", "Denyut jantung istirahat", hasData && reading.heartRate.resting > 0 ? String(reading.heartRate.resting) : "-", "bpm"),
        ],
      }
    }
    case "sleep": {
      const hasData = reading.sleep.totalMinutes > 0
      const headline = stat("total", "Tidur malam", hasData ? formatDuration(reading.sleep.totalMinutes) : "0 mnt", "")
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
        stats: [headline, stat("schedule", "Waktu tidur", reading.sleep.bedtime !== "-" ? `${reading.sleep.bedtime}–${reading.sleep.wakeTime}` : "-", ""), ...nap],
      }
    }
    case "spo2": {
      const hasData = reading.spo2.average > 0
      const headline = stat("average", "Rata-rata SpO₂", hasData ? String(reading.spo2.average) : "-", "%")
      return {
        points: reading.spo2.readings.map((item) => ({ key: item.time, label: item.time, value: item.value, low: null, high: null })),
        headline,
        stats: [headline, stat("range", "Rentang SpO₂", hasData ? `${reading.spo2.min}–${reading.spo2.max}` : "-", "%")],
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
