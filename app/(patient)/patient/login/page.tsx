import type { Metadata } from "next"

import { AuthView } from "@/components/patient/auth-view"

export const metadata: Metadata = { title: "Masuk" }

export default function PatientLoginPage() {
  return <AuthView />
}
