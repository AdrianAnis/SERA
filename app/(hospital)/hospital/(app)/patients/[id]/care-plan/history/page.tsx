import type { Metadata } from "next"

import { PlanHistoryView } from "@/components/hospital/plan-history-view"

export const metadata: Metadata = { title: "Riwayat care plan" }

export default async function CarePlanHistoryPage({ params }: PageProps<"/hospital/patients/[id]/care-plan/history">) {
  const { id } = await params
  return <PlanHistoryView patientId={id} />
}
