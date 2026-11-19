import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AvailabilityDay, AvailabilityTimeField, Consultation, ConsultationStatus } from "@/features/consultation/types"
import { consultationApi, type ConsultationRequestItem, type DoctorSession, type DoctorDateSchedule } from "@/lib/api"
import { mockAvailability } from "@/mocks/consultations"

const CONSULTATION_STORAGE_KEY = "hc:consultation"

export function mapRequestToConsultation(req: ConsultationRequestItem): Consultation {
  let startsAt = req.createdAt
  if (req.scheduledDate && req.scheduledTime) {
    startsAt = `${req.scheduledDate}T${req.scheduledTime}:00`
  }

  let status: ConsultationStatus = "scheduled"
  if (req.status === "rejected" || req.status === "cancelled") {
    status = "cancelled"
  } else {
    const startsDate = new Date(startsAt)
    const isPast = !isNaN(startsDate.getTime()) && startsDate < new Date()
    status = isPast && req.status === "approved" ? "completed" : "scheduled"
  }

  return {
    id: req.id,
    patientId: req.patientId || req.userId,
    doctorId: req.doctorId,
    startsAt,
    durationMinutes: 30,
    topic: req.notes || `Consultation - ${req.userName}`,
    status,
    cancelReason:
      req.status === "rejected"
        ? "Rejected by doctor"
        : req.status === "cancelled"
        ? "Cancelled by patient"
        : null,
    cancelledAt: req.status === "rejected" || req.status === "cancelled" ? req.updatedAt : null,
    reconfirmedAt: null,
    patientName: req.userName,
    userEmail: req.userEmail,
    userPhone: req.userPhone,
    requestStatus: req.status,
  }
}

type ConsultationState = {
  consultations: Consultation[]
  availability: AvailabilityDay[]
  dateSchedules: Record<string, DoctorDateSchedule>
  isLoading: boolean
  error: string | null
  fetchConsultations: (token?: string, doctorId?: string) => Promise<void>
  fetchDateAvailability: (token?: string, month?: string) => Promise<void>
  saveDateAvailability: (date: string, isActive: boolean, sessions: DoctorSession[], token?: string) => Promise<boolean>
  cancelConsultation: (consultationId: string, reason: string, token?: string) => Promise<void>
  reconfirmConsultation: (consultationId: string) => void
  setAvailabilityActive: (availabilityId: string, isActive: boolean) => void
  setAvailabilityTime: (availabilityId: string, field: AvailabilityTimeField, value: string) => boolean
}

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      consultations: [],
      availability: mockAvailability,
      dateSchedules: {},
      isLoading: false,
      error: null,
      fetchConsultations: async (token?: string, doctorId?: string) => {
        set({ isLoading: true, error: null })
        try {
          const requests = await consultationApi.getDoctorRequests(token)
          const remoteConsultations = requests.map(mapRequestToConsultation)
          set({
            consultations: remoteConsultations,
            isLoading: false,
          })
        } catch (err) {
          console.error("Failed to load consultations from backend:", err)
          set({
            error: (err as Error).message || "Failed to load consultations",
            isLoading: false,
          })
        }
      },
      fetchDateAvailability: async (token?: string, month?: string) => {
        try {
          const schedules = await consultationApi.getDoctorAvailability(month, token)
          const map: Record<string, DoctorDateSchedule> = {}
          for (const s of schedules) {
            map[s.date] = s
          }
          set((state) => ({ dateSchedules: { ...state.dateSchedules, ...map } }))
        } catch (err) {
          console.error("Failed to load doctor date availability:", err)
        }
      },
      saveDateAvailability: async (date: string, isActive: boolean, sessions: DoctorSession[], token?: string) => {
        try {
          const res = await consultationApi.updateDoctorAvailability({ date, isActive, sessions }, token)
          const updated = res.data ?? { id: `dds-${date}`, doctorId: "", date, isActive, sessions }
          set((state) => ({
            dateSchedules: {
              ...state.dateSchedules,
              [date]: updated,
            },
          }))
          return true
        } catch (err) {
          console.error("Failed to save doctor date availability:", err)
          throw err
        }
      },
      cancelConsultation: async (consultationId: string, reason: string, token?: string) => {
        try {
          if (token) {
            await consultationApi.rejectRequest(consultationId, token)
          }
        } catch (err) {
          console.error("Failed to cancel consultation on backend:", err)
        }
        set((state) => ({
          consultations: state.consultations.map((consultation) =>
            consultation.id === consultationId
              ? {
                  ...consultation,
                  status: "cancelled",
                  cancelReason: reason.trim() || null,
                  cancelledAt: new Date().toISOString(),
                }
              : consultation,
          ),
        }))
      },
      reconfirmConsultation: (consultationId) =>
        set((state) => ({
          consultations: state.consultations.map((consultation) =>
            consultation.id === consultationId && consultation.status === "scheduled"
              ? { ...consultation, reconfirmedAt: new Date().toISOString() }
              : consultation,
          ),
        })),
      setAvailabilityActive: (availabilityId, isActive) =>
        set((state) => ({
          availability: state.availability.map((day) => (day.id === availabilityId ? { ...day, isActive } : day)),
        })),
      setAvailabilityTime: (availabilityId, field, value) => {
        const day = get().availability.find((item) => item.id === availabilityId)
        if (!day || !value) return false
        const next = { ...day, [field]: value }
        if (next.startTime >= next.endTime) return false
        set((state) => ({ availability: state.availability.map((item) => (item.id === availabilityId ? next : item)) }))
        return true
      },
    }),
    {
      name: CONSULTATION_STORAGE_KEY,
      version: 3,
      migrate: () => ({ consultations: [], availability: mockAvailability }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ availability: state.availability }),
      skipHydration: true,
    },
  ),
)
