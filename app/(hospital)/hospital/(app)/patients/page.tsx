import type { Metadata } from "next"

import { PatientListView } from "@/components/hospital/patient-list-view"

export const metadata: Metadata = { title: "Pasien" }

export default function PatientsPage() {
  return <PatientListView />
}
