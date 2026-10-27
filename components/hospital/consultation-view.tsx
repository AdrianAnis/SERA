"use client"

import { useState } from "react"
import { addMonths, startOfMonth } from "date-fns"
import { toast } from "sonner"

import { AvailabilityCard } from "@/components/hospital/availability-card"
import { CancelConsultationDialog } from "@/components/hospital/cancel-consultation-dialog"
import { ConsultationCalendar } from "@/components/hospital/consultation-calendar"
import { ConsultationDayPanel } from "@/components/hospital/consultation-day-panel"
import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
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
  const patients = usePatientStore((state) => state.patients)
  const consultations = useConsultationStore((state) => state.consultations)
  const availability = useConsultationStore((state) => state.availability)
  const cancelConsultation = useConsultationStore((state) => state.cancelConsultation)
  const reconfirmConsultation = useConsultationStore((state) => state.reconfirmConsultation)
  const setAvailabilityActive = useConsultationStore((state) => state.setAvailabilityActive)
  const setAvailabilityTime = useConsultationStore((state) => state.setAvailabilityTime)
  const now = useNow()
  const [selectedDateKey, setSelectedDateKey] = useState(() => initialDateKey ?? toDateKey(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(toDate(selectedDateKey)))
  const [cancelTarget, setCancelTarget] = useState<Consultation | null>(null)

  if (!isHydrated || !doctor) return <HospitalPageSkeleton />

  const patientNames = Object.fromEntries(patients.map((patient) => [patient.id, patient.name]))
  const doctorConsultations = selectDoctorConsultations(consultations, doctor.id)
  const doctorAvailability = selectDoctorAvailability(availability, doctor.id)
  const upcomingCount = selectUpcomingConsultations(doctorConsultations, now).length
  const reconfirmationIds = selectConsultationsNeedingReconfirmation(doctorConsultations, doctorAvailability, now).map((consultation) => consultation.id)

  function handleSelectDate(dateKey: string): void {
    setSelectedDateKey(dateKey)
    setVisibleMonth(startOfMonth(toDate(dateKey)))
  }

  function handleGoToToday(): void {
    handleSelectDate(toDateKey(now))
  }

  function handleTimeChange(availabilityId: string, field: AvailabilityTimeField, value: string): void {
    if (!setAvailabilityTime(availabilityId, field, value)) toast.error("Jam selesai harus setelah jam mulai")
  }

  function handleCancelDialogChange(isOpen: boolean): void {
    if (!isOpen) setCancelTarget(null)
  }

  function handleReconfirm(consultation: Consultation): void {
    reconfirmConsultation(consultation.id)
    toast.success("Jadwal konsultasi dikonfirmasi ulang")
  }

  function handleConfirmCancel(reason: string): void {
    if (!cancelTarget) return
    cancelConsultation(cancelTarget.id, reason)
    setCancelTarget(null)
    toast.success("Jadwal konsultasi dibatalkan")
  }

  return (
    <>
      <PageHeader title="Jadwal Konsultasi" description={`${upcomingCount} konsultasi mendatang.`} />
      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <ConsultationCalendar
            month={visibleMonth}
            today={now}
            consultations={doctorConsultations}
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
            consultations={selectConsultationsOnDate(doctorConsultations, selectedDateKey)}
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
        patientName={cancelTarget ? (patientNames[cancelTarget.patientId] ?? cancelTarget.patientId) : ""}
        onOpenChange={handleCancelDialogChange}
        onConfirm={handleConfirmCancel}
      />
    </>
  )
}
