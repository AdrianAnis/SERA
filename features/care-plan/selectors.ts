import type { CarePlan, CarePlanItem, CarePlanItemKind, CarePlanItemOf } from "@/features/care-plan/types"

export function selectPatientPlans(plans: CarePlan[], patientId: string): CarePlan[] {
  return plans.filter((plan) => plan.patientId === patientId)
}

export function selectActivePlan(plans: CarePlan[], patientId: string): CarePlan | undefined {
  return plans.find((plan) => plan.patientId === patientId && plan.status === "active")
}

export function selectPlanHistory(plans: CarePlan[], patientId: string): CarePlan[] {
  return selectPatientPlans(plans, patientId).sort((a, b) => b.version - a.version)
}

export function selectItemsByKind<K extends CarePlanItemKind>(
  plan: CarePlan | undefined,
  kind: K,
): CarePlanItemOf<K>[] {
  return plan?.items.filter((item): item is CarePlanItemOf<K> => item.kind === kind) ?? []
}

export function selectPlanItem(plan: CarePlan | undefined, itemId: string): CarePlanItem | undefined {
  return plan?.items.find((item) => item.id === itemId)
}

export function selectNextFollowUp(plan: CarePlan | undefined, todayKey: string): CarePlanItemOf<"followUp"> | undefined {
  return selectItemsByKind(plan, "followUp")
    .filter((item) => item.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

export function selectUnacknowledgedPlan(
  activePlan: CarePlan | undefined,
  acknowledgedPlanId: string | undefined,
): CarePlan | undefined {
  if (!activePlan || !acknowledgedPlanId || activePlan.id === acknowledgedPlanId) return undefined
  return activePlan
}

export type PatientPlanStatus = "active" | "none"

export function selectPatientPlanStatus(plans: CarePlan[], patientId: string): PatientPlanStatus {
  return selectActivePlan(plans, patientId) ? "active" : "none"
}

