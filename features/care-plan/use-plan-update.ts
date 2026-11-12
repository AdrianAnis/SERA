"use client"

import { useAuthStore } from "@/features/auth/store"
import { selectUnacknowledgedPlan } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import type { CarePlan } from "@/features/care-plan/types"
import { usePatientContext } from "@/features/patient/use-patient-context"

export type PlanUpdate = {
  updatedPlan: CarePlan | undefined
  doctorName: string | undefined
  acknowledge: () => void
}

export function usePlanUpdate(): PlanUpdate {
  const patientSession = useAuthStore((state) => state.patient)
  const { patient, activePlan, activeDoctor } = usePatientContext()
  const acknowledgedPlanId = useCarePlanStore((state) => (patient ? state.acknowledgedPlanIds[patient.id] : undefined))
  const acknowledgePlan = useCarePlanStore((state) => state.acknowledgePlan)

  const updatedPlan = selectUnacknowledgedPlan(activePlan, acknowledgedPlanId)

  function acknowledge(): void {
    if (patient && updatedPlan) {
      void acknowledgePlan(patient.id, updatedPlan.id, patientSession?.token)
    }
  }

  return { updatedPlan, doctorName: activeDoctor?.name, acknowledge }
}
