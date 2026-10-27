import type { HealthHistoryType } from "@/features/patient/types"

export const HEALTH_HISTORY_TYPE_LABEL: Record<HealthHistoryType, string> = {
  diagnosis: "Diagnosis",
  visit: "Kunjungan",
  lab: "Laboratorium",
  procedure: "Tindakan",
  vital: "Tanda vital",
}
