"use client"

import { WearableEmptyState } from "@/components/hospital/wearable-empty-state"
import { WearableMetricCard } from "@/components/wearable-metric-card"
import { selectConnection } from "@/features/wearable/selectors"
import { WEARABLE_METRICS } from "@/features/wearable/schema"
import { useWearableStore } from "@/features/wearable/store"
import { selectMetricTrend } from "@/features/wearable/trend-selectors"
import { toDateKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"

type WearableSectionProps = {
  patientId: string
  patientName: string
}

export function WearableSection({ patientId, patientName }: WearableSectionProps) {
  const connections = useWearableStore((state) => state.connections)
  const now = useNow()
  const connection = selectConnection(connections, patientId)

  return (
    <section className="rounded-2xl border bg-card xl:col-span-3">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">Data kesehatan dari smartwatch</h2>
        <p className="type-caption">Langkah, detak jantung, tidur, dan saturasi oksigen pasien.</p>
      </header>
      {connection ? (
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {WEARABLE_METRICS.map((metric) => (
            <WearableMetricCard key={metric} href={routes.hospital.monitoringMetric(patientId, metric)} metric={metric} trend={selectMetricTrend(patientId, metric, "day", toDateKey(now), now)} />
          ))}
        </div>
      ) : (
        <WearableEmptyState patientName={patientName} />
      )}
    </section>
  )
}
