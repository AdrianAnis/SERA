"use client"

import { useAuthStore } from "@/features/auth/store"
import { selectActivePlan } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import type { CarePlan } from "@/features/care-plan/types"
import { selectDoctorById, selectPatientById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import type { Doctor, Patient } from "@/features/patient/types"
import { useHydrated } from "@/lib/use-hydrated"

export type PatientContext = {
  isHydrated: boolean
  patient: Patient | undefined
  activePlan: CarePlan | undefined
  activeDoctor: Doctor | undefined
}

export function usePatientContext(): PatientContext {
  const isHydrated = useHydrated()
  const patientId = useAuthStore((state) => state.patient?.userId)
  const patients = usePatientStore((state) => state.patients)
  const doctors = usePatientStore((state) => state.doctors)
  const plans = useCarePlanStore((state) => state.plans)

  const patient = patientId ? selectPatientById(patients, patientId) : undefined
  const activePlan = patient ? selectActivePlan(plans, patient.id) : undefined
  const activeDoctor = activePlan ? selectDoctorById(doctors, activePlan.createdBy) : undefined

  return { isHydrated, patient, activePlan, activeDoctor }
}
