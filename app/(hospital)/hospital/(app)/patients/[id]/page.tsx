import type { Metadata } from "next"

import { PatientDetailView } from "@/components/hospital/patient-detail-view"

export const metadata: Metadata = { title: "Patient details" }

export default async function PatientDetailPage({ params }: PageProps<"/hospital/patients/[id]">) {
  const { id } = await params
  return <PatientDetailView patientId={id} />
}
