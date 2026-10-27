import { z } from "zod"

export const WEARABLE_METRICS = ["steps", "heart-rate", "sleep", "spo2"] as const

export const wearableMetricSchema = z.enum(WEARABLE_METRICS)

export type WearableMetric = z.infer<typeof wearableMetricSchema>
