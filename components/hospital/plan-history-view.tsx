"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { PlanItemsList } from "@/components/hospital/plan-items-list"
import { StatusDot, type StatusTone } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CARE_PLAN_STATUS_LABEL } from "@/features/care-plan/labels"
import type { CarePlan, CarePlanStatus } from "@/features/care-plan/types"
import { selectDoctorById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { formatDateTime } from "@/lib/date"
import { routes } from "@/lib/routes"

type PlanHistoryViewProps = {
  patientId: string
}

const STATUS_TONE: Record<CarePlanStatus, StatusTone> = {
  active: "success",
  superseded: "muted",
}

export function PlanHistoryView({ patientId }: PlanHistoryViewProps) {
  const { isHydrated, patient, planHistory } = usePatientRecord(patientId)
  const doctors = usePatientStore((state) => state.doctors)
  const [viewedPlan, setViewedPlan] = useState<CarePlan | null>(null)

  if (!isHydrated) return <HospitalPageSkeleton />

  return (
    <>
      <PageHeader
        title="Riwayat care plan"
        description={patient ? `Semua versi untuk ${patient.name}. Versi lama hanya bisa dibaca.` : "Pasien tidak ditemukan."}
        actions={
          <Button asChild variant="outline">
            <Link href={routes.hospital.patientDetail(patientId)}>
              <ChevronLeft />
              Kembali ke pasien
            </Link>
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border bg-card">
          <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs font-medium text-muted-foreground md:grid">
            <span className="col-span-2">Versi</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-3">Dibuat oleh</span>
            <span className="col-span-3">Dikonfirmasi</span>
            <span className="col-span-2 text-right">Isi</span>
          </div>
          <ul className="divide-y">
            {planHistory.map((plan) => (
              <li key={plan.id} className="grid items-center gap-2 px-5 py-4 md:grid-cols-12 md:gap-4">
                <span className="text-sm font-semibold md:col-span-2">Versi {plan.version}</span>
                <div className="md:col-span-2">
                  <StatusDot tone={STATUS_TONE[plan.status]} label={CARE_PLAN_STATUS_LABEL[plan.status]} />
                </div>
                <span className="text-sm md:col-span-3">{selectDoctorById(doctors, plan.createdBy)?.name ?? plan.createdBy}</span>
                <span className="type-caption md:col-span-3">{plan.confirmedAt ? formatDateTime(plan.confirmedAt) : "-"}</span>
                <div className="md:col-span-2 md:text-right">
                  <Button variant="outline" size="sm" onClick={() => setViewedPlan(plan)}>
                    Lihat
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={viewedPlan !== null} onOpenChange={(isOpen) => (isOpen ? undefined : setViewedPlan(null))}>
        <DialogContent className="max-h-dvh gap-5 overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Care plan versi {viewedPlan?.version}</DialogTitle>
            <DialogDescription>{viewedPlan?.sourceText}</DialogDescription>
          </DialogHeader>
          {viewedPlan ? <PlanItemsList plan={viewedPlan} /> : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
