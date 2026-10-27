"use client"

import { CalendarCheck, CalendarClock, Users } from "lucide-react"

import { DashboardAttentionCard } from "@/components/hospital/dashboard-attention-card"
import { DashboardFollowUpsCard, type FollowUpRow } from "@/components/hospital/dashboard-followups-card"
import { DashboardHero } from "@/components/hospital/dashboard-hero"
import { DashboardStatCard } from "@/components/hospital/dashboard-stat-card"
import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { useDoctorContext } from "@/features/auth/use-doctor-context"
import {
  selectActivePlan,
  selectNextFollowUp,
} from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import { useCompanionStore } from "@/features/companion/store"
import {
  selectConsultationsNeedingReconfirmation,
  selectDoctorAvailability,
  selectDoctorConsultations,
  selectNextConsultation,
  selectTodayConsultations,
} from "@/features/consultation/selectors"
import { useConsultationStore } from "@/features/consultation/store"
import { selectAttentionItems } from "@/features/dashboard/selectors"
import { useFeedbackStore } from "@/features/feedback/store"
import { usePatientStore } from "@/features/patient/store"
import { toDateKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useHydrated } from "@/lib/use-hydrated"
import { useNow } from "@/lib/use-now"

const FOLLOW_UP_LIMIT = 4

export function DashboardView() {
  const isHydrated = useHydrated()
  const { doctor } = useDoctorContext()
  const patients = usePatientStore((state) => state.patients)
  const plans = useCarePlanStore((state) => state.plans)
  const feedbackEntries = useFeedbackStore((state) => state.entries)
  const threads = useCompanionStore((state) => state.threads)
  const consultations = useConsultationStore((state) => state.consultations)
  const availability = useConsultationStore((state) => state.availability)
  const now = useNow()

  if (!isHydrated) return <HospitalPageSkeleton />

  const patientNames = Object.fromEntries(patients.map((patient) => [patient.id, patient.name]))
  const attentionItems = selectAttentionItems({ feedbackEntries, threads })
  const doctorConsultations = doctor ? selectDoctorConsultations(consultations, doctor.id) : []
  const doctorAvailability = doctor ? selectDoctorAvailability(availability, doctor.id) : []
  const todayConsultationCount = selectTodayConsultations(doctorConsultations, now).length
  const reconfirmationCount = selectConsultationsNeedingReconfirmation(doctorConsultations, doctorAvailability, now).length

  const followUpRows = patients
    .flatMap<FollowUpRow>((patient) => {
      const followUp = selectNextFollowUp(selectActivePlan(plans, patient.id), toDateKey(now))
      return followUp ? [{ patientId: patient.id, name: patient.name, date: followUp.date, instruction: followUp.instruction }] : []
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, FOLLOW_UP_LIMIT)

  const nextConsultation = selectNextConsultation(doctorConsultations, now)
  const heroAction = nextConsultation
    ? { href: routes.hospital.consultationsOn(toDateKey(nextConsultation.startsAt)), label: "Tinjau konsultasi terdekat" }
    : { href: routes.hospital.consultations, label: "Lihat jadwal konsultasi" }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHero doctorName={doctor?.name ?? "Dokter"} now={now} pendingCount={attentionItems.length} action={heroAction} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard icon={Users} label="Pasien" value={patients.length} href={routes.hospital.patientList} />
        <DashboardStatCard icon={CalendarClock} label="Jadwal konsultasi hari ini" value={todayConsultationCount} href={routes.hospital.consultations} />
        <DashboardStatCard icon={CalendarCheck} label="Jadwal yang mesti dikonfirmasi ulang" value={reconfirmationCount} href={routes.hospital.consultations} />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardAttentionCard items={attentionItems} patientNames={patientNames} />
        </div>
        <DashboardFollowUpsCard rows={followUpRows} />
      </div>
    </div>
  )
}
