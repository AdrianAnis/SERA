"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { OnboardingSteps } from "@/components/patient/onboarding-steps"
import { SplashScreen } from "@/components/patient/splash-screen"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { routes } from "@/lib/routes"

const SPLASH_DURATION_MS = 2000

export function PatientEntry() {
  const router = useRouter()
  const { isHydrated, patient } = usePatientContext()
  const [isSplashDone, setIsSplashDone] = useState(false)
  const hasSession = isHydrated && patient !== undefined

  useEffect(() => {
    const timerId = window.setTimeout(() => setIsSplashDone(true), SPLASH_DURATION_MS)
    return () => window.clearTimeout(timerId)
  }, [])

  useEffect(() => {
    if (hasSession) router.replace(routes.patient.today)
  }, [hasSession, router])

  if (!isSplashDone || hasSession) return <SplashScreen />

  return <OnboardingSteps />
}
