import type { Metadata } from "next"

import { CompanionView } from "@/components/patient/companion-view"
import { PatientSessionGate } from "@/components/patient/patient-session-gate"

export const metadata: Metadata = { title: "Companion" }

export default function CompanionPage() {
  return (
    <PatientSessionGate>
      <CompanionView />
    </PatientSessionGate>
  )
}
