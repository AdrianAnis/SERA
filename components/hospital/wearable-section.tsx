"use client"

import { useEffect, useState } from "react"

import { WearableEmptyState } from "@/components/hospital/wearable-empty-state"
import { WearableMetricCard } from "@/components/wearable-metric-card"
import { useAuthStore } from "@/features/auth/store"
import { selectConnection } from "@/features/wearable/selectors"
import { WEARABLE_METRICS, type WearableMetric } from "@/features/wearable/schema"
import { useWearableStore } from "@/features/wearable/store"
import { selectMetricTrend } from "@/features/wearable/trend-selectors"
import type { MetricTrend } from "@/features/wearable/types"
import { wearableApi } from "@/lib/api"
import { toDateKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"

type WearableSectionProps = {
  patientId: string
  patientName: string
}

type MonitoringData = {
  isConnected: boolean
  deviceName?: string
  metrics?: Record<WearableMetric, MetricTrend>
}

export function WearableSection({ patientId, patientName }: WearableSectionProps) {
  const doctorSession = useAuthStore((state) => state.doctor)
  const connections = useWearableStore((state) => state.connections)
  const now = useNow()
  const localConnection = selectConnection(connections, patientId)

  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null)

  useEffect(() => {
    let isCancelled = false
    async function loadMonitoring() {
      if (!doctorSession?.token || !patientId) return
      try {
        const res = await wearableApi.getHospitalMonitoring(patientId, toDateKey(now), doctorSession.token)
        if (!isCancelled && res) {
          setMonitoringData({
            isConnected: Boolean(res.connection && res.connection.isConnected),
            deviceName: res.connection?.deviceName,
            metrics: res.metrics,
          })
        }
      } catch (err) {
        console.error("[WearableSection] Failed to load hospital monitoring from backend:", err)
      }
    }
    void loadMonitoring()
    return () => {
      isCancelled = true
    }
  }, [patientId, doctorSession?.token, now])

  const isConnected = monitoringData ? monitoringData.isConnected : Boolean(localConnection)

  return (
    <section className="rounded-2xl border bg-card xl:col-span-3">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">Data kesehatan dari smartwatch</h2>
        <p className="type-caption">Langkah, detak jantung, tidur, dan saturasi oksigen pasien.</p>
      </header>
      {isConnected ? (
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {WEARABLE_METRICS.map((metric) => {
            const trend =
              monitoringData?.metrics?.[metric] ??
              selectMetricTrend(patientId, metric, "day", toDateKey(now), now)
            return (
              <WearableMetricCard
                key={metric}
                href={routes.hospital.monitoringMetric(patientId, metric)}
                metric={metric}
                trend={trend}
              />
            )
          })}
        </div>
      ) : (
        <WearableEmptyState patientName={patientName} />
      )}
    </section>
  )
}
