"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { useDoctorContext } from "@/features/auth/use-doctor-context"
import { routes } from "@/lib/routes"

type DoctorSessionGateProps = {
  children: React.ReactNode
}

export function DoctorSessionGate({ children }: DoctorSessionGateProps) {
  const router = useRouter()
  const { isHydrated, doctor } = useDoctorContext()
  const hasNoSession = isHydrated && !doctor

  useEffect(() => {
    if (hasNoSession) router.replace(routes.hospital.login)
  }, [hasNoSession, router])

  if (!isHydrated || hasNoSession) return <HospitalPageSkeleton />

  return children
}
