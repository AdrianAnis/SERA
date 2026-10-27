import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DEMO_DOCTOR_ID, DEMO_PATIENT_ID } from "@/mocks/patients"

const AUTH_STORAGE_KEY = "hc:auth"

type Surface = "doctor" | "patient"

type Session = {
  userId: string
  signedInAt: string
}

type AuthState = {
  doctor: Session | null
  patient: Session | null
  loginDoctor: () => void
  loginPatient: () => void
  logout: (surface: Surface) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      patient: null,
      loginDoctor: () => set({ doctor: { userId: DEMO_DOCTOR_ID, signedInAt: new Date().toISOString() } }),
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
