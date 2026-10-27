"use client"

import { useRouter } from "next/navigation"

import { useAuthStore } from "@/features/auth/store"
import { routes } from "@/lib/routes"

export type PatientActions = {
  logout: () => void
}

export function usePatientActions(): PatientActions {
  const router = useRouter()
  const logoutPatient = useAuthStore((state) => state.logout)

  function logout(): void {
    logoutPatient("patient")
    router.replace(routes.patient.landing)
  }

  return { logout }
}
