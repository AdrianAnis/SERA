"use client"

import { useEffect } from "react"
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
  const patientSession = useAuthStore((state) => state.patient)
  const patientId = patientSession?.patientId || (patientSession?.userId?.startsWith("p-") ? patientSession.userId : undefined)
  const patients = usePatientStore((state) => state.patients)
  const doctors = usePatientStore((state) => state.doctors)
  const plans = useCarePlanStore((state) => state.plans)
  const fetchPatientRecord = usePatientStore((state) => state.fetchPatientRecord)

  useEffect(() => {
    if (patientId && patientId.startsWith("p-")) {
      void fetchPatientRecord(patientId)
    }
  }, [patientId, fetchPatientRecord])

  let patient = patientId ? selectPatientById(patients, patientId) : undefined

  // For unlinked users (registered via app, not yet connected to hospital MRN):
  if (!patient && patientSession) {
    patient = {
      id: patientSession.userId,
      mrn: "UNLINKED",
      name: patientSession.name || "Pasien",
      gender: "male",
      birthDate: "2000-01-01",
      phone: "-",
      guardianName: "-",
      guardianPhone: "-",
      address: "-",
      primaryDiagnosis: "Belum terhubung ke Faskes",
      conditions: [],
      allergies: [],
      assignedDoctorId: "",
    }
  }

  const activePlan = patient && patient.mrn !== "UNLINKED" ? selectActivePlan(plans, patient.id) : undefined
  const activeDoctor = activePlan ? selectDoctorById(doctors, activePlan.createdBy) : undefined

  return { isHydrated, patient, activePlan, activeDoctor }
}
