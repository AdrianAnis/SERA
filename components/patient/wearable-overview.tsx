"use client"

import { toast } from "sonner"

import { WearableConnectPrompt } from "@/components/patient/wearable-connect-prompt"
import { Button } from "@/components/ui/button"
import { WearableMetricCard } from "@/components/wearable-metric-card"
import { WEARABLE_METRICS } from "@/features/wearable/schema"
import { selectConnection } from "@/features/wearable/selectors"
import { useWearableStore } from "@/features/wearable/store"
import { selectMetricTrend } from "@/features/wearable/trend-selectors"
import { formatDate, toDateKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"

type WearableOverviewProps = {
  patientId: string
}

export function WearableOverview({ patientId }: WearableOverviewProps) {
  const connections = useWearableStore((state) => state.connections)
  const disconnectWearable = useWearableStore((state) => state.disconnectWearable)
  const now = useNow()
  const connection = selectConnection(connections, patientId)

  function handleDisconnect(): void {
    disconnectWearable(patientId)
    toast.success("Smartwatch diputuskan")
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="type-subheading">Data smartwatch</h3>
        <p className="type-caption">Langkah, detak jantung, tidur, dan saturasi oksigen kamu.</p>
      </div>
      {connection ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {WEARABLE_METRICS.map((metric) => (
              <WearableMetricCard
                key={metric}
                href={routes.patient.activityMetric(metric)}
                metric={metric}
                trend={selectMetricTrend(patientId, metric, "day", toDateKey(now), now)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="type-caption">
              {connection.deviceName} · terhubung sejak {formatDate(connection.connectedAt)}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={handleDisconnect}>
              Putuskan smartwatch
            </Button>
          </div>
        </>
      ) : (
        <WearableConnectPrompt patientId={patientId} />
      )}
    </div>
  )
}
