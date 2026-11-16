import type { Metadata } from "next"

import { CarePlanBuilderView } from "@/components/hospital/care-plan-builder-view"

export const metadata: Metadata = { title: "Care plan" }

export default async function CarePlanBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CarePlanBuilderView patientId={id} />
}
