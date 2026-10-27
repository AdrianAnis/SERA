"use client"

import { selectActivePlan, selectPlanHistory } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import type { CarePlan } from "@/features/care-plan/types"
import { selectDoctorById, selectPatientById, selectPatientHistory } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import type { Doctor, HealthHistoryEntry, Patient } from "@/features/patient/types"
import { useHydrated } from "@/lib/use-hydrated"

export type PatientRecord = {
  isHydrated: boolean
  patient: Patient | undefined
  doctor: Doctor | undefined
  activePlan: CarePlan | undefined
  planHistory: CarePlan[]
  healthHistory: HealthHistoryEntry[]
}

export function usePatientRecord(patientId: string): PatientRecord {
  const isHydrated = useHydrated()
  const patients = usePatientStore((state) => state.patients)
  const doctors = usePatientStore((state) => state.doctors)
  const history = usePatientStore((state) => state.history)
  const plans = useCarePlanStore((state) => state.plans)

  const patient = selectPatientById(patients, patientId)

  return {
    isHydrated,
    patient,
    doctor: patient ? selectDoctorById(doctors, patient.assignedDoctorId) : undefined,
    activePlan: selectActivePlan(plans, patientId),
    planHistory: selectPlanHistory(plans, patientId),
    healthHistory: selectPatientHistory(history, patientId),
  }
}
