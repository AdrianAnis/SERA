import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { WearableDetailView } from "@/components/hospital/wearable-detail-view"
import { wearableMetricSchema } from "@/features/wearable/schema"

export const metadata: Metadata = { title: "Data smartwatch" }

export default async function WearableMetricPage({ params }: PageProps<"/hospital/patients/[id]/monitoring/[metric]">) {
  const { id, metric } = await params
  const parsedMetric = wearableMetricSchema.safeParse(metric)
  if (!parsedMetric.success) notFound()
  return <WearableDetailView patientId={id} metric={parsedMetric.data} />
}
