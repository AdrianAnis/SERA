import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DEMO_PATIENT_ID, mockDoctors } from "@/mocks/patients"

const AUTH_STORAGE_KEY = "hc:auth"

type Surface = "doctor" | "patient"

type Session = {
  userId: string
  signedInAt: string
}

type AuthState = {
  doctor: Session | null
  patient: Session | null
  loginDoctor: (email: string) => boolean
  loginPatient: () => void
  logout: (surface: Surface) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      patient: null,
      loginDoctor: (email) => {
        const doctor = mockDoctors.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
        if (!doctor) return false
        set({ doctor: { userId: doctor.id, signedInAt: new Date().toISOString() } })
        return true
      },
      loginPatient: () => set({ patient: { userId: DEMO_PATIENT_ID, signedInAt: new Date().toISOString() } }),
      logout: (surface) => set(surface === "doctor" ? { doctor: null } : { patient: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ doctor: state.doctor, patient: state.patient }),
      skipHydration: true,
    },
  ),
)
