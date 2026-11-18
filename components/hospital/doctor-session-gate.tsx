"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { useAuthStore } from "@/features/auth/store"
import { useHydrated } from "@/lib/use-hydrated"
import { routes } from "@/lib/routes"

type DoctorSessionGateProps = {
  children: React.ReactNode
}

export function DoctorSessionGate({ children }: DoctorSessionGateProps) {
  const router = useRouter()
  const isHydrated = useHydrated()
  const doctorSession = useAuthStore((state) => state.doctor)
  const hasNoSession = isHydrated && !doctorSession

  useEffect(() => {
    if (hasNoSession) router.replace(routes.hospital.login)
  }, [hasNoSession, router])

  if (!isHydrated || hasNoSession) return <HospitalPageSkeleton />

  return children
}
