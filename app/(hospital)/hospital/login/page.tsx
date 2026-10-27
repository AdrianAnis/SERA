import type { Metadata } from "next"

import { LoginView } from "@/components/hospital/login-view"

export const metadata: Metadata = { title: "Masuk" }

export default function HospitalLoginPage() {
  return <LoginView />
}
