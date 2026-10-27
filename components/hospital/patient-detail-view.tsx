"use client"

import Link from "next/link"
import { FilePenLine, LineChart, UserX } from "lucide-react"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { PatientHistoryTimeline } from "@/components/hospital/patient-history-timeline"
import { PlanItemsList } from "@/components/hospital/plan-items-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFeedbackStore } from "@/features/feedback/store"
import { selectPatientAge } from "@/features/patient/selectors"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { selectAdherenceByDay, selectAdherenceRatio } from "@/features/reminder/selectors"
import { formatDate } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"
import { getInitials } from "@/lib/utils"

type PatientDetailViewProps = {
  patientId: string
}

type ReadOnlyFieldProps = {
  id: string
  label: string
  value: string
}

function ReadOnlyField({ id, label, value }: ReadOnlyFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <Input id={id} readOnly value={value} className="border-transparent bg-muted focus-visible:ring-0" />
    </div>
  )
}

export function PatientDetailView({ patientId }: PatientDetailViewProps) {
  const { isHydrated, patient, doctor, activePlan, planHistory, healthHistory } = usePatientRecord(patientId)
  const completions = useFeedbackStore((state) => state.completions)
  const now = useNow()

  if (!isHydrated) return <HospitalPageSkeleton />

  if (!patient) {
    return (
      <>
        <PageHeader title="Pasien tidak ditemukan" />
        <div className="flex flex-col items-center gap-3 p-10 text-center text-muted-foreground">
          <UserX className="size-8" />
          <p>Pasien dengan ID ini tidak ada di daftar Anda.</p>
          <Button asChild variant="outline">
            <Link href={routes.hospital.patientList}>Kembali ke daftar pasien</Link>
          </Button>
        </div>
      </>
    )
  }

  const adherenceRatio = selectAdherenceRatio(selectAdherenceByDay(planHistory, completions, now))
  const adherencePercentage = adherenceRatio === null ? 0 : Math.round(adherenceRatio * 100)

  return (
    <>
      <PageHeader
        title={patient.name}
        description={`${patient.mrn} · ${patient.primaryDiagnosis}`}
        leading={
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={routes.hospital.monitoring(patient.id)}>
                <LineChart />
                Monitoring
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.hospital.carePlanHistory(patient.id)}>Riwayat versi</Link>
            </Button>
            <Button asChild>
              <Link href={routes.hospital.carePlanNew(patient.id)}>
                <FilePenLine />
                Revisi care plan
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 p-4 md:p-6 xl:grid-cols-3">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border bg-card p-5">
            <h2 className="type-subheading">Identitas</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <ReadOnlyField id="detail-age" label="Usia" value={`${selectPatientAge(patient, now)} tahun`} />
              <ReadOnlyField id="detail-phone" label="Nomor HP" value={patient.phone} />
              <ReadOnlyField id="detail-guardian-name" label="Nama wali" value={patient.guardianName} />
              <ReadOnlyField id="detail-guardian-phone" label="Nomor HP wali" value={patient.guardianPhone} />
              <ReadOnlyField id="detail-conditions" label="Kondisi" value={patient.conditions.join(", ")} />
              <ReadOnlyField id="detail-allergies" label="Alergi" value={patient.allergies.length > 0 ? patient.allergies.join(", ") : "Tidak ada"} />
              <ReadOnlyField id="detail-doctor" label="Dokter" value={doctor?.name ?? "-"} />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border bg-card p-5">
            <h2 className="type-subheading">Riwayat kesehatan</h2>
            <PatientHistoryTimeline entries={healthHistory} />
          </section>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <section className="space-y-5 rounded-2xl border bg-card p-5">
            <header>
              <h2 className="type-subheading">Care plan aktif{activePlan ? ` · Versi ${activePlan.version}` : ""}</h2>
              <p className="type-caption">
                {activePlan?.confirmedAt ? `Dikonfirmasi ${formatDate(activePlan.confirmedAt)}` : "Belum ada care plan aktif."}
              </p>
            </header>
            {activePlan ? <PlanItemsList plan={activePlan} /> : null}
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <header className="flex items-baseline justify-between gap-3">
              <div>
                <h2 className="type-subheading">Tingkat Kepatuhan</h2>
                <p className="type-caption">7 hari terakhir. Data perilaku, bukan indikator kesembuhan.</p>
              </div>
              <span className="text-2xl font-semibold tabular-nums">{adherenceRatio === null ? "-" : `${adherencePercentage}%`}</span>
            </header>
            <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${adherencePercentage}%` }} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
