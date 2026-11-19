"use client"

import { useEffect, useState } from "react"
import { addMonths, startOfMonth } from "date-fns"
import { toast } from "sonner"

import { AvailabilityCard } from "@/components/hospital/availability-card"
import { CancelConsultationDialog } from "@/components/hospital/cancel-consultation-dialog"
import { ConsultationCalendar } from "@/components/hospital/consultation-calendar"
import { ConsultationDayPanel } from "@/components/hospital/consultation-day-panel"
import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { useAuthStore } from "@/features/auth/store"
import { useDoctorContext } from "@/features/auth/use-doctor-context"
import {
  selectConsultationsNeedingReconfirmation,
  selectConsultationsOnDate,
  selectDoctorAvailability,
  selectDoctorConsultations,
  selectUpcomingConsultations,
} from "@/features/consultation/selectors"
import { useConsultationStore } from "@/features/consultation/store"
import type { AvailabilityTimeField, Consultation } from "@/features/consultation/types"
import { usePatientStore } from "@/features/patient/store"
import { toDate, toDateKey } from "@/lib/date"
import { useNow } from "@/lib/use-now"

type ConsultationViewProps = {
  initialDateKey?: string
}

export function ConsultationView({ initialDateKey }: ConsultationViewProps) {
  const { isHydrated, doctor } = useDoctorContext()
  const doctorSession = useAuthStore((state) => state.doctor)
  const patients = usePatientStore((state) => state.patients)
  const fetchPatients = usePatientStore((state) => state.fetchPatients)
  const consultations = useConsultationStore((state) => state.consultations)
  const availability = useConsultationStore((state) => state.availability)
  const fetchConsultations = useConsultationStore((state) => state.fetchConsultations)
  const cancelConsultation = useConsultationStore((state) => state.cancelConsultation)
  const reconfirmConsultation = useConsultationStore((state) => state.reconfirmConsultation)
  const setAvailabilityActive = useConsultationStore((state) => state.setAvailabilityActive)
  const setAvailabilityTime = useConsultationStore((state) => state.setAvailabilityTime)
  const now = useNow()
  const [selectedDateKey, setSelectedDateKey] = useState(() => initialDateKey ?? toDateKey(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(toDate(selectedDateKey)))
  const [cancelTarget, setCancelTarget] = useState<Consultation | null>(null)

  useEffect(() => {
    if (doctorSession?.token) {
      void fetchConsultations(doctorSession.token, doctor?.id)
    }
    if (patients.length === 0) {
      void fetchPatients()
    }
  }, [fetchConsultations, fetchPatients, doctorSession?.token, doctor?.id, patients.length])

  if (!isHydrated || !doctor) return <HospitalPageSkeleton />

  const patientNames: Record<string, string> = {
    ...Object.fromEntries(patients.map((patient) => [patient.id, patient.name])),
    ...Object.fromEntries(
      consultations
        .filter((c) => c.patientName)
        .flatMap((c) => [
          [c.patientId, c.patientName!],
          [c.id, c.patientName!],
        ]),
    ),
  }

  const doctorConsultations = selectDoctorConsultations(consultations, doctor.id)
  const activeConsultations = doctorConsultations.length > 0 ? doctorConsultations : consultations
  const doctorAvailability = selectDoctorAvailability(availability, doctor.id)
  const upcomingCount = selectUpcomingConsultations(activeConsultations, now).length
  const reconfirmationIds = selectConsultationsNeedingReconfirmation(activeConsultations, doctorAvailability, now).map((consultation) => consultation.id)

  function handleSelectDate(dateKey: string): void {
    setSelectedDateKey(dateKey)
    setVisibleMonth(startOfMonth(toDate(dateKey)))
  }

  function handleGoToToday(): void {
    handleSelectDate(toDateKey(now))
  }

  function handleTimeChange(availabilityId: string, field: AvailabilityTimeField, value: string): void {
    if (!setAvailabilityTime(availabilityId, field, value)) toast.error("End time must be after start time")
  }

  function handleCancelDialogChange(isOpen: boolean): void {
    if (!isOpen) setCancelTarget(null)
  }

  function handleReconfirm(consultation: Consultation): void {
    reconfirmConsultation(consultation.id)
    toast.success("Consultation reconfirmed")
  }

  async function handleConfirmCancel(reason: string): Promise<void> {
    if (!cancelTarget) return
    await cancelConsultation(cancelTarget.id, reason, doctorSession?.token)
    setCancelTarget(null)
    toast.success("Consultation cancelled")
  }

  return (
    <>
      <PageHeader title="Consultations" description={`${upcomingCount} upcoming consultation(s).`} />
      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <ConsultationCalendar
            month={visibleMonth}
            today={now}
            consultations={activeConsultations}
            patientNames={patientNames}
            inactiveWeekdays={doctorAvailability.filter((day) => !day.isActive).map((day) => day.weekday)}
            selectedDateKey={selectedDateKey}
            onSelectDate={handleSelectDate}
            onShiftMonth={(delta) => setVisibleMonth((month) => addMonths(month, delta))}
            onGoToToday={handleGoToToday}
          />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <ConsultationDayPanel
            dateKey={selectedDateKey}
            now={now}
            consultations={selectConsultationsOnDate(activeConsultations, selectedDateKey)}
            patientNames={patientNames}
            reconfirmationIds={reconfirmationIds}
            onCancel={setCancelTarget}
            onReconfirm={handleReconfirm}
          />
          <AvailabilityCard days={doctorAvailability} onToggle={setAvailabilityActive} onTimeChange={handleTimeChange} />
        </div>
      </div>
      <CancelConsultationDialog
        key={cancelTarget?.id}
        consultation={cancelTarget}
        patientName={cancelTarget ? (patientNames[cancelTarget.patientId] ?? cancelTarget.patientName ?? cancelTarget.patientId) : ""}
        onOpenChange={handleCancelDialogChange}
        onConfirm={handleConfirmCancel}
      />
    </>
  )
}
