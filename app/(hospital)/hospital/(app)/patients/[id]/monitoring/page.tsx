import type { Metadata } from "next"

import { MonitoringView } from "@/components/hospital/monitoring-view"

export const metadata: Metadata = { title: "Monitoring" }

type MonitoringPageProps = {
  params: Promise<{ id: string }>
}

export default async function MonitoringPage({ params }: MonitoringPageProps) {
  const { id } = await params
  return <MonitoringView patientId={id} />
}
