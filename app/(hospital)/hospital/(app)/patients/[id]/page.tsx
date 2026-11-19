import type { Metadata } from "next"

import { PatientDetailView } from "@/components/hospital/patient-detail-view"

export const metadata: Metadata = { title: "Patient details" }

type PatientDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params
  return <PatientDetailView patientId={id} />
}
