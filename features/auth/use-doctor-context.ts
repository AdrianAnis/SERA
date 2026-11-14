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
  const doctorSession = useAuthStore((state) => state.doctor)
  const doctorId = doctorSession?.doctorId || doctorSession?.userId
  const doctors = usePatientStore((state) => state.doctors)

  let doctor = doctorId ? selectDoctorById(doctors, doctorId) : undefined

  if (!doctor && doctorSession) {
    doctor = {
      id: doctorSession.doctorId || doctorSession.userId,
      name: doctorSession.name || "Dr. Haruka Tanaka, MD",
      specialty: "Internal Medicine",
      email: doctorSession.email || "haruka.tanaka@gmail.com",
      hospital: "Sakura General Hospital",
    }
  }

  return { isHydrated, doctor }
}
