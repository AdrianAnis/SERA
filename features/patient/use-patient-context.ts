"use client"

import { useCallback, useEffect } from "react"
import { useAuthStore } from "@/features/auth/store"
import { selectActivePlan } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import type { CarePlan } from "@/features/care-plan/types"
import { selectDoctorById, selectPatientById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import type { Doctor, Patient } from "@/features/patient/types"
import { authApi } from "@/lib/api"
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
  const loginPatient = useAuthStore((state) => state.loginPatient)
  const patientId =
    patientSession?.patientId ||
    (patientSession?.userId?.startsWith("p-") ? patientSession.userId : undefined)
  const patients = usePatientStore((state) => state.patients)
  const doctors = usePatientStore((state) => state.doctors)
  const plans = useCarePlanStore((state) => state.plans)
  const fetchPatientActivePlan = useCarePlanStore((state) => state.fetchPatientActivePlan)
  const fetchPatientRecord = usePatientStore((state) => state.fetchPatientRecord)

  // Sync latest patient record ID and active care plan from backend
  const syncSession = useCallback(async () => {
    if (!patientSession?.token) return
    try {
      const me = await authApi.getMe(patientSession.token)
      if (me.patientId && me.patientId !== patientSession.patientId) {
        loginPatient({
          ...patientSession,
          patientId: me.patientId,
          name: me.name || patientSession.name,
        })
      }
      // Sync active care plan from backend for this patient
      void fetchPatientActivePlan(patientSession.token)
    } catch {
      // Silently ignore if offline
    }
  }, [patientSession, loginPatient, fetchPatientActivePlan])

  useEffect(() => {
    void syncSession()

    window.addEventListener("focus", syncSession)
    return () => {
      window.removeEventListener("focus", syncSession)
    }
  }, [syncSession])

  useEffect(() => {
    if (patientId && patientId.startsWith("p-")) {
      void fetchPatientRecord(patientId)
    }
  }, [patientId, fetchPatientRecord])

  let patient = patientId ? selectPatientById(patients, patientId) : undefined

  // For unlinked users (registered via app, not yet connected to hospital MRN):
  if (!patient && patientSession) {
    patient = {
      id: patientId || patientSession.userId,
      mrn: patientId ? "Menghubungkan..." : "UNLINKED",
      name: patientSession.name || "Pasien",
      gender: "male",
      birthDate: "",
      phone: "-",
      guardianName: "-",
      guardianPhone: "-",
      address: "-",
      primaryDiagnosis: "-",
      conditions: [],
      allergies: [],
      assignedDoctorId: "",
    }
  }

  const effectivePatientId = patientId || (patient && patient.mrn !== "UNLINKED" ? patient.id : undefined)
  const activePlan = effectivePatientId ? selectActivePlan(plans, effectivePatientId) : undefined
  const activeDoctor = activePlan ? selectDoctorById(doctors, activePlan.createdBy) : undefined

  return { isHydrated, patient, activePlan, activeDoctor }
}
