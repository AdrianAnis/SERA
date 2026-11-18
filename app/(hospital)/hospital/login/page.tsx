import type { Metadata } from "next"

import { LoginView } from "@/components/hospital/login-view"

export const metadata: Metadata = { title: "Sign in" }

export default function HospitalLoginPage() {
  return <LoginView />
}
