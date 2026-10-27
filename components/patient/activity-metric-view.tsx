"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { PageSkeleton } from "@/components/patient/page-skeleton"
import { WearableConnectPrompt } from "@/components/patient/wearable-connect-prompt"
import { WearablePeriodExplorer } from "@/components/wearable-period-explorer"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { WEARABLE_METRIC_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import { selectConnection } from "@/features/wearable/selectors"
import { useWearableStore } from "@/features/wearable/store"
import { routes } from "@/lib/routes"

type ActivityMetricViewProps = {
  metric: WearableMetric
}

export function ActivityMetricView({ metric }: ActivityMetricViewProps) {
  const { isHydrated, patient } = usePatientContext()
  const connections = useWearableStore((state) => state.connections)

  if (!isHydrated || !patient) return <PageSkeleton />

  const connection = selectConnection(connections, patient.id)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href={routes.patient.activity} className="flex min-h-11 w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-5" />
          Kembali ke aktivitas
        </Link>
        <h1 className="type-title">{WEARABLE_METRIC_LABEL[metric]}</h1>
        {connection ? <p className="type-caption">{connection.deviceName}</p> : null}
      </div>
      <section className="rounded-3xl border bg-card shadow-sm">
        {connection ? <WearablePeriodExplorer patientId={patient.id} metric={metric} /> : <div className="p-5"><WearableConnectPrompt patientId={patient.id} /></div>}
      </section>
    </div>
  )
}
