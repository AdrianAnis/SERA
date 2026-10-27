"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { WearableEmptyState } from "@/components/hospital/wearable-empty-state"
import { WearablePeriodExplorer } from "@/components/wearable-period-explorer"
import { Button } from "@/components/ui/button"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { WEARABLE_METRIC_LABEL } from "@/features/wearable/labels"
import type { WearableMetric } from "@/features/wearable/schema"
import { selectConnection } from "@/features/wearable/selectors"
import { useWearableStore } from "@/features/wearable/store"
import { routes } from "@/lib/routes"

type WearableDetailViewProps = {
  patientId: string
  metric: WearableMetric
}

export function WearableDetailView({ patientId, metric }: WearableDetailViewProps) {
  const { isHydrated, patient } = usePatientRecord(patientId)
  const connections = useWearableStore((state) => state.connections)

  if (!isHydrated) return <HospitalPageSkeleton />

  if (!patient) return <PageHeader title="Pasien tidak ditemukan" description="Data smartwatch tidak bisa dibuka tanpa data pasien." />

  const connection = selectConnection(connections, patientId)

  return (
    <>
      <PageHeader
        title={WEARABLE_METRIC_LABEL[metric]}
        description={connection ? `${patient.name} · ${connection.deviceName}` : patient.name}
        actions={
          <Button asChild variant="outline">
            <Link href={routes.hospital.monitoring(patientId)}>
              <ChevronLeft />
              Kembali ke monitoring
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <section className="rounded-2xl border bg-card">
          {connection ? <WearablePeriodExplorer patientId={patientId} metric={metric} /> : <WearableEmptyState patientName={patient.name} />}
        </section>
      </div>
    </>
  )
}
