import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AvailabilityDay, AvailabilityTimeField, Consultation } from "@/features/consultation/types"
import { mockAvailability, mockConsultations } from "@/mocks/consultations"

const CONSULTATION_STORAGE_KEY = "hc:consultation"

type ConsultationState = {
  consultations: Consultation[]
  availability: AvailabilityDay[]
  cancelConsultation: (consultationId: string, reason: string) => void
  reconfirmConsultation: (consultationId: string) => void
  setAvailabilityActive: (availabilityId: string, isActive: boolean) => void
  setAvailabilityTime: (availabilityId: string, field: AvailabilityTimeField, value: string) => boolean
}

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      consultations: mockConsultations,
      availability: mockAvailability,
      cancelConsultation: (consultationId, reason) =>
        set((state) => ({
          consultations: state.consultations.map((consultation) =>
            consultation.id === consultationId && consultation.status === "scheduled"
              ? { ...consultation, status: "cancelled", cancelReason: reason.trim() || null, cancelledAt: new Date().toISOString() }
              : consultation,
          ),
        })),
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
      version: 2,
      migrate: () => ({ consultations: mockConsultations, availability: mockAvailability }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ consultations: state.consultations, availability: state.availability }),
      skipHydration: true,
    },
  ),
)
