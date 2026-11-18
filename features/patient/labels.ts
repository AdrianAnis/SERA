import type { HealthHistoryType } from "@/features/patient/types"

export const HEALTH_HISTORY_TYPE_LABEL: Record<HealthHistoryType, string> = {
  diagnosis: "Diagnosis",
  visit: "Visit",
  lab: "Laboratory",
  procedure: "Procedure",
  vital: "Vital signs",
}
