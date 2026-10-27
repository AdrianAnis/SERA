import { StatusDot, type StatusTone } from "@/components/status-dot"
import { PATIENT_PLAN_STATUS_LABEL } from "@/features/care-plan/labels"
import type { PatientPlanStatus } from "@/features/care-plan/selectors"

type PlanStatusLabelProps = {
  status: PatientPlanStatus
}

const STATUS_TONE: Record<PatientPlanStatus, StatusTone> = {
  active: "success",
  none: "muted",
}

export function PlanStatusLabel({ status }: PlanStatusLabelProps) {
  return <StatusDot tone={STATUS_TONE[status]} label={PATIENT_PLAN_STATUS_LABEL[status]} />
}
