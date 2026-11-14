"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { PageSkeleton } from "@/components/patient/page-skeleton"
import { useAuthStore } from "@/features/auth/store"
import { useHydrated } from "@/lib/use-hydrated"
import { routes } from "@/lib/routes"

type PatientSessionGateProps = {
  children: React.ReactNode
}

export function PatientSessionGate({ children }: PatientSessionGateProps) {
  const router = useRouter()
  const isHydrated = useHydrated()
  const patientSession = useAuthStore((state) => state.patient)
  const hasNoSession = isHydrated && !patientSession

  useEffect(() => {
    if (hasNoSession) router.replace(routes.patient.login)
  }, [hasNoSession, router])

  if (!isHydrated || hasNoSession) return <PageSkeleton />

  return children
}
