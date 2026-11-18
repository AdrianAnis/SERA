import type { PatientPlanStatus } from "@/features/care-plan/selectors"
import type { CarePlanItemKind, CarePlanStatus, DietItem } from "@/features/care-plan/types"

export const CARE_PLAN_STATUS_LABEL: Record<CarePlanStatus, string> = {
  active: "Active",
  superseded: "Superseded",
}

export const CARE_PLAN_ITEM_KIND_LABEL: Record<CarePlanItemKind, string> = {
  medication: "Medication",
  diet: "Diet",
  activity: "Activity",
  restriction: "Restriction",
  followUp: "Follow-up",
}

export const DIET_RULE_LABEL: Record<DietItem["rule"], string> = {
  avoid: "Avoid",
  limit: "Limit",
  recommend: "Recommended",
}

export const CARE_PLAN_KIND_ORDER: CarePlanItemKind[] = ["medication", "diet", "activity", "restriction", "followUp"]

export const PATIENT_PLAN_STATUS_LABEL: Record<PatientPlanStatus, string> = {
  active: "Has care plan",
  none: "No care plan yet",
}
