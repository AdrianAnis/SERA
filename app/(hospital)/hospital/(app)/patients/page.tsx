import type { Metadata } from "next"

import { PatientListView } from "@/components/hospital/patient-list-view"

export const metadata: Metadata = { title: "Patients" }

export default function PatientsPage() {
  return <PatientListView />
}
