import { addMinutes, eachDayOfInterval, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns"

import { WEEKDAY_DISPLAY_ORDER } from "@/features/consultation/labels"
import type { AvailabilityDay, Consultation } from "@/features/consultation/types"
import { getWeekday, toDate, toDateKey, toTimeKey } from "@/lib/date"

export function selectConsultationEndsAt(consultation: Consultation): Date {
  return addMinutes(toDate(consultation.startsAt), consultation.durationMinutes)
}

export function selectDoctorConsultations(consultations: Consultation[], doctorId: string): Consultation[] {
  return consultations.filter((consultation) => consultation.doctorId === doctorId)
}

function isUpcoming(consultation: Consultation, now: Date): boolean {
  return consultation.status === "scheduled" && toDate(consultation.startsAt) >= startOfDay(now)
}

export function selectUpcomingConsultations(consultations: Consultation[], now: Date): Consultation[] {
  return consultations.filter((consultation) => isUpcoming(consultation, now)).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

function isWithinAvailability(consultation: Consultation, availability: AvailabilityDay[]): boolean {
  const day = availability.find((item) => item.weekday === getWeekday(consultation.startsAt))
  if (!day?.isActive) return false
  return toTimeKey(consultation.startsAt) >= day.startTime && toTimeKey(selectConsultationEndsAt(consultation)) <= day.endTime
}

export function selectTodayConsultations(consultations: Consultation[], now: Date): Consultation[] {
  return selectConsultationsOnDate(consultations, toDateKey(now)).filter((consultation) => consultation.status === "scheduled")
}

export function selectConsultationsNeedingReconfirmation(consultations: Consultation[], availability: AvailabilityDay[], now: Date): Consultation[] {
  return selectUpcomingConsultations(consultations, now).filter(
    (consultation) => consultation.reconfirmedAt === null && !isWithinAvailability(consultation, availability),
  )
}

export function selectNextConsultation(consultations: Consultation[], now: Date): Consultation | undefined {
  return consultations
    .filter((consultation) => consultation.status === "scheduled" && selectConsultationEndsAt(consultation) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0]
}

export function selectConsultationsOnDate(consultations: Consultation[], dateKey: string): Consultation[] {
  return consultations.filter((consultation) => toDateKey(consultation.startsAt) === dateKey).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

export function selectMonthGridDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })
}

export function selectDoctorAvailability(availability: AvailabilityDay[], doctorId: string): AvailabilityDay[] {
  return availability
    .filter((day) => day.doctorId === doctorId)
    .sort((a, b) => WEEKDAY_DISPLAY_ORDER.indexOf(a.weekday) - WEEKDAY_DISPLAY_ORDER.indexOf(b.weekday))
}
