import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ActivityMetricView } from "@/components/patient/activity-metric-view"
import { wearableMetricSchema } from "@/features/wearable/schema"

export const metadata: Metadata = { title: "Data smartwatch" }

export default async function ActivityMetricPage({ params }: PageProps<"/patient/profile/[metric]">) {
  const { metric } = await params
  const parsedMetric = wearableMetricSchema.safeParse(metric)
  if (!parsedMetric.success) notFound()
  return <ActivityMetricView metric={parsedMetric.data} />
}
