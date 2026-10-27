import type { Metadata } from "next"

import { MonitoringView } from "@/components/hospital/monitoring-view"

export const metadata: Metadata = { title: "Monitoring" }

export default async function MonitoringPage({ params }: PageProps<"/hospital/patients/[id]/monitoring">) {
  const { id } = await params
  return <MonitoringView patientId={id} />
}
