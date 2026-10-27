export type WearablePeriod = "day" | "week" | "month" | "year"

export type WearableConnection = {
  deviceName: string
  connectedAt: string
}

type SleepStages = {
  deep: number
  light: number
  rem: number
  awake: number
}

type Spo2Reading = {
  time: string
  value: number
}

export type DailyReadings = {
  date: string
  steps: { total: number; hourly: number[] }
  heartRate: { resting: number; min: number; max: number; hourly: number[] }
  sleep: { totalMinutes: number; napMinutes: number; stages: SleepStages; bedtime: string; wakeTime: string }
  spo2: { average: number; min: number; max: number; readings: Spo2Reading[] }
}

export type TrendPoint = {
  key: string
  label: string
  value: number | null
  low: number | null
  high: number | null
}

export type MetricStat = {
  key: string
  label: string
  value: string
  unit: string
}

export type MetricTrend = {
  points: TrendPoint[]
  headline: MetricStat
  stats: MetricStat[]
}
