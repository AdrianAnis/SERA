import type { WearableMetric } from "@/features/wearable/schema"
import type { WearablePeriod } from "@/features/wearable/types"

export const WEARABLE_METRIC_LABEL: Record<WearableMetric, string> = {
  steps: "Langkah",
  "heart-rate": "Detak jantung",
  sleep: "Tidur",
  spo2: "SpO₂",
}

export const WEARABLE_PERIOD_LABEL: Record<WearablePeriod, string> = {
  day: "Hari",
  week: "Minggu",
  month: "Bulan",
  year: "Tahun",
}

export const WEARABLE_PERIOD_ORDER: WearablePeriod[] = ["day", "week", "month", "year"]

export const SLEEP_STAGE_LABEL = {
  deep: "Nyenyak",
  light: "Ringan",
  rem: "REM",
  awake: "Terjaga",
} as const
