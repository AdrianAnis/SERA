import type { Metadata } from "next"

import { PlanHistoryView } from "@/components/hospital/plan-history-view"

export const metadata: Metadata = { title: "Care plan history" }

export default async function CarePlanHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlanHistoryView patientId={id} />
}
