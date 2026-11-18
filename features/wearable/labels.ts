import type { WearableMetric } from "@/features/wearable/schema"
import type { WearablePeriod } from "@/features/wearable/types"

export const WEARABLE_METRIC_LABEL: Record<WearableMetric, string> = {
  steps: "Steps",
  "heart-rate": "Heart rate",
  sleep: "Sleep",
  spo2: "SpO₂",
}

export const WEARABLE_PERIOD_LABEL: Record<WearablePeriod, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
}

export const WEARABLE_PERIOD_ORDER: WearablePeriod[] = ["day", "week", "month", "year"]

export const SLEEP_STAGE_LABEL = {
  deep: "Deep",
  light: "Light",
  rem: "REM",
  awake: "Awake",
} as const
