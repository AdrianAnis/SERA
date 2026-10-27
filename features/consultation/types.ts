export type ConsultationStatus = "scheduled" | "completed" | "cancelled"

export type Consultation = {
  id: string
  patientId: string
  doctorId: string
  startsAt: string
  durationMinutes: number
  topic: string
  status: ConsultationStatus
  cancelReason: string | null
  cancelledAt: string | null
  reconfirmedAt: string | null
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type AvailabilityDay = {
  id: string
  doctorId: string
  weekday: Weekday
  isActive: boolean
  startTime: string
  endTime: string
}

export type AvailabilityTimeField = "startTime" | "endTime"
