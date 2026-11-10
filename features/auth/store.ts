import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DEMO_DOCTOR_ID, DEMO_PATIENT_ID } from "@/mocks/patients"

const AUTH_STORAGE_KEY = "hc:auth"

type Surface = "doctor" | "patient"

export type Session = {
  userId: string
  signedInAt: string
  token?: string
  name?: string
  email?: string
}

type AuthState = {
  doctor: Session | null
  patient: Session | null
  loginDoctor: (session?: Partial<Session>) => void
  loginPatient: (session?: Partial<Session>) => void
  logout: (surface: Surface) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      patient: null,
      loginDoctor: (session) =>
        set({
          doctor: {
            userId: session?.userId || DEMO_DOCTOR_ID,
            token: session?.token,
            name: session?.name,
            email: session?.email,
            signedInAt: session?.signedInAt || new Date().toISOString(),
          },
        }),
      loginPatient: (session) =>
        set({
          patient: {
            userId: session?.userId || DEMO_PATIENT_ID,
            token: session?.token,
            name: session?.name,
            email: session?.email,
            signedInAt: session?.signedInAt || new Date().toISOString(),
          },
        }),
      logout: (surface) => set(surface === "doctor" ? { doctor: null } : { patient: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      version: 4,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ doctor: state.doctor, patient: state.patient }),
      skipHydration: true,
      migrate: (persistedState: any) => ({
        doctor: persistedState?.doctor || null,
        patient: persistedState?.patient || null,
      }),
    },
  ),
)
