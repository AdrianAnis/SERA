"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { PageSkeleton } from "@/components/patient/page-skeleton"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { routes } from "@/lib/routes"

type PatientSessionGateProps = {
  children: React.ReactNode
}

export function PatientSessionGate({ children }: PatientSessionGateProps) {
  const router = useRouter()
  const { isHydrated, patient } = usePatientContext()
  const hasNoSession = isHydrated && !patient

  useEffect(() => {
    if (hasNoSession) router.replace(routes.patient.login)
  }, [hasNoSession, router])

  if (!isHydrated || hasNoSession) return <PageSkeleton />

  return children
}
