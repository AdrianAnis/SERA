"use client"

import { useAuthStore } from "@/features/auth/store"
import { selectDoctorById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import type { Doctor } from "@/features/patient/types"
import { useHydrated } from "@/lib/use-hydrated"

export type DoctorContext = {
  isHydrated: boolean
  doctor: Doctor | undefined
}

export function useDoctorContext(): DoctorContext {
  const isHydrated = useHydrated()
  const doctorId = useAuthStore((state) => state.doctor?.userId)
  const doctors = usePatientStore((state) => state.doctors)

  return { isHydrated, doctor: doctorId ? selectDoctorById(doctors, doctorId) : undefined }
}
