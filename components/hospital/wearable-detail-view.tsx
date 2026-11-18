"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { WearableEmptyState } from "@/components/hospital/wearable-empty-state"
import { WearablePeriodExplorer } from "@/components/wearable-period-explorer"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { WEARABLE_METRIC_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import { selectConnection } from "@/features/wearable/selectors"
import { useWearableStore } from "@/features/wearable/store"
import { wearableApi } from "@/lib/api"
import { routes } from "@/lib/routes"

type WearableDetailViewProps = {
  patientId: string
  metric: WearableMetric
}

export function WearableDetailView({ patientId, metric }: WearableDetailViewProps) {
  const { isHydrated, patient } = usePatientRecord(patientId)
  const doctorSession = useAuthStore((state) => state.doctor)
  const connections = useWearableStore((state) => state.connections)
  const connection = selectConnection(connections, patientId)

  const [deviceConnected, setDeviceConnected] = useState<boolean | null>(null)
  const [deviceName, setDeviceName] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    async function checkMonitoring() {
      if (!doctorSession?.token || !patientId) return
      try {
        const res = await wearableApi.getHospitalMonitoring(patientId, undefined, doctorSession.token)
        if (!isCancelled && res) {
          setDeviceConnected(Boolean(res.connection && res.connection.isConnected))
          setDeviceName(res.connection?.deviceName ?? null)
        }
      } catch (err) {
        console.error("[WearableDetailView] Failed to check monitoring from backend:", err)
      }
    }
    void checkMonitoring()
    return () => {
      isCancelled = true
    }
  }, [patientId, doctorSession?.token])

  if (!isHydrated) return <HospitalPageSkeleton />

  if (!patient) return <PageHeader title="Patient not found" description="Smartwatch data cannot be opened without patient data." />

  const hasConnection = deviceConnected !== null ? deviceConnected : Boolean(connection)
  const activeDeviceName = deviceName || connection?.deviceName

  return (
    <>
      <PageHeader
        title={WEARABLE_METRIC_LABEL[metric]}
        description={hasConnection && activeDeviceName ? `${patient.name} · ${activeDeviceName}` : patient.name}
        actions={
          <Button asChild variant="outline">
            <Link href={routes.hospital.monitoring(patientId)}>
              <ChevronLeft />
              Back to monitoring
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <section className="rounded-2xl border bg-card">
          {hasConnection ? <WearablePeriodExplorer patientId={patientId} metric={metric} /> : <WearableEmptyState patientName={patient.name} />}
        </section>
      </div>
    </>
  )
}
