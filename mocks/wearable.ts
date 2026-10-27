import type { DailyReadings, WearableConnection } from "@/features/wearable/types"
import { daysFromToday } from "@/lib/date"

export const DEFAULT_WEARABLE_DEVICE_NAME = "HUAWEI WATCH GT 4"

type WearableProfile = {
  baseSteps: number
  restingHeartRate: number
  sleepMinutes: number
  baseSpo2: number
}

const WEARABLE_PROFILES: Record<string, WearableProfile> = {
  "p-001": { baseSteps: 6500, restingHeartRate: 74, sleepMinutes: 380, baseSpo2: 96 },
  "p-002": { baseSteps: 4200, restingHeartRate: 80, sleepMinutes: 340, baseSpo2: 95 },
  "p-003": { baseSteps: 3200, restingHeartRate: 68, sleepMinutes: 440, baseSpo2: 98 },
}

const DEFAULT_PROFILE: WearableProfile = { baseSteps: 5000, restingHeartRate: 72, sleepMinutes: 400, baseSpo2: 97 }

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

const HOURLY_STEP_WEIGHTS = [0, 0, 0, 0, 0, 0.01, 0.05, 0.09, 0.08, 0.05, 0.04, 0.05, 0.08, 0.06, 0.04, 0.04, 0.06, 0.1, 0.09, 0.06, 0.04, 0.03, 0.02, 0.01]

const SPO2_READING_TIMES = ["02:10", "04:30", "07:30", "13:00", "20:00"]

const MINUTES_PER_DAY = 1440

function createRandom(seedText: string): () => number {
  let state = [...seedText].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), state | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function formatClock(totalMinutes: number): string {
  const normalized = totalMinutes % MINUTES_PER_DAY
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

export function buildDailyReadings(patientId: string, dateKey: string): DailyReadings {
  const random = createRandom(`${patientId}:${dateKey}`)
  const profile = WEARABLE_PROFILES[patientId] ?? DEFAULT_PROFILE

  const dayFactor = 0.7 + random() * 0.6
  const weightTotal = sum(HOURLY_STEP_WEIGHTS)
  const hourlySteps = HOURS.map((hour) => Math.round(((profile.baseSteps * dayFactor * (HOURLY_STEP_WEIGHTS[hour] ?? 0)) / weightTotal) * (0.8 + random() * 0.4)))

  const hourlyHeartRate = HOURS.map((hour) => {
    const base = profile.restingHeartRate + (hour < 6 ? -6 : 6)
    return Math.round(base + random() * 8 + (hourlySteps[hour] ?? 0) / (profile.baseSteps * 0.01))
  })

  const totalSleep = Math.round(profile.sleepMinutes * (0.85 + random() * 0.3))
  const awake = Math.round(totalSleep * (0.05 + random() * 0.03))
  const deep = Math.round(totalSleep * (0.17 + random() * 0.05))
  const rem = Math.round(totalSleep * (0.2 + random() * 0.05))
  const bedtimeMinutes = 22 * 60 + Math.round(random() * 75)

  const spo2Readings = SPO2_READING_TIMES.map((time) => ({ time, value: Math.min(100, Math.round(profile.baseSpo2 + random() * 3 - 1.5)) }))
  const spo2Values = spo2Readings.map((reading) => reading.value)

  return {
    date: dateKey,
    steps: { total: sum(hourlySteps), hourly: hourlySteps },
    heartRate: {
      resting: profile.restingHeartRate + Math.round(random() * 4 - 2),
      min: Math.min(...hourlyHeartRate) - 3,
      max: Math.max(...hourlyHeartRate) + Math.round(10 + random() * 25),
      hourly: hourlyHeartRate,
    },
    sleep: {
      totalMinutes: totalSleep,
      napMinutes: random() < 0.3 ? Math.round(20 + random() * 30) : 0,
      stages: { deep, light: totalSleep - awake - deep - rem, rem, awake },
      bedtime: formatClock(bedtimeMinutes),
      wakeTime: formatClock(bedtimeMinutes + totalSleep + awake),
    },
    spo2: {
      average: Math.round(sum(spo2Values) / spo2Values.length),
      min: Math.min(...spo2Values),
      max: Math.max(...spo2Values),
      readings: spo2Readings,
    },
  }
}

export const mockWearableConnections: Record<string, WearableConnection> = {
  "p-001": { deviceName: DEFAULT_WEARABLE_DEVICE_NAME, connectedAt: daysFromToday(-60, "09:00") },
  "p-002": { deviceName: "HUAWEI WATCH FIT 3", connectedAt: daysFromToday(-30, "10:30") },
}
