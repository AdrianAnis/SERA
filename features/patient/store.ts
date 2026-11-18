import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { Doctor, HealthHistoryEntry, Patient } from "@/features/patient/types"
import { ApiError, patientApi } from "@/lib/api"
import { mockDoctors, mockPatients } from "@/mocks/patients"
import { mockHistory } from "@/mocks/history"

const PATIENT_STORAGE_KEY = "hc:patient"

type PatientState = {
  doctors: Doctor[]
  patients: Patient[]
  history: HealthHistoryEntry[]
  isLoading: boolean
  error: string | null
  fetchPatients: () => Promise<void>
  fetchPatientRecord: (patientId: string) => Promise<void>
  findPatientByMrn: (mrn: string) => Promise<Patient | null>
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      doctors: mockDoctors,
      patients: mockPatients,
      history: mockHistory,
      isLoading: false,
      error: null,

      fetchPatients: async () => {
        set({ isLoading: true, error: null })
        try {
          const remotePatients = await patientApi.getPatients()
          const extractedDoctors: Doctor[] = []

          remotePatients.forEach((p) => {
            if ((p as Patient & { doctor?: Doctor }).doctor) {
              const doc = (p as Patient & { doctor?: Doctor }).doctor!
              if (!extractedDoctors.some((d) => d.id === doc.id)) {
                extractedDoctors.push(doc)
              }
            }
          })

          set((state) => ({
            patients: remotePatients,
            doctors: extractedDoctors.length > 0 ? extractedDoctors : state.doctors,
            isLoading: false,
          }))
        } catch (err) {
          console.error("Gagal mengambil data pasien dari backend:", err)
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      fetchPatientRecord: async (patientId: string) => {
        set({ isLoading: true, error: null })
        try {
          const record = await patientApi.getPatientRecord(patientId)
          set((state) => {
            const updatedPatients = state.patients.some((p) => p.id === record.patient.id)
              ? state.patients.map((p) => (p.id === record.patient.id ? record.patient : p))
              : [...state.patients, record.patient]

            const updatedDoctors = record.doctor
              ? state.doctors.some((d) => d.id === record.doctor!.id)
                ? state.doctors.map((d) => (d.id === record.doctor!.id ? record.doctor! : d))
                : [...state.doctors, record.doctor]
              : state.doctors

            const otherHistories = state.history.filter((h) => h.patientId !== patientId)
            const updatedHistory = [...otherHistories, ...record.healthHistory]

            return {
              patients: updatedPatients,
              doctors: updatedDoctors,
              history: updatedHistory,
              isLoading: false,
            }
          })
        } catch (err) {
          console.error(`Gagal mengambil record pasien ${patientId} dari backend:`, err)
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      findPatientByMrn: async (mrn: string) => {
        const normalizedMrn = mrn.trim()
        try {
          const patient = await patientApi.validateMrn(normalizedMrn)
          set((state) => ({
            patients: state.patients.some((p) => p.id === patient.id)
              ? state.patients.map((p) => (p.id === patient.id ? patient : p))
              : [...state.patients, patient],
          }))
          return patient
        } catch (err) {
          const localPatient = get().patients.find((p) => p.mrn.toLowerCase() === normalizedMrn.toLowerCase())
          if (localPatient) return localPatient
          if (err instanceof ApiError && err.statusCode === 404) return null
          throw err
        }
      },
    }),
    {
      name: PATIENT_STORAGE_KEY,
      version: 6,
      migrate: () => ({
        doctors: mockDoctors,
        patients: mockPatients,
        history: mockHistory,
        isLoading: false,
        error: null,
      }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        doctors: state.doctors,
        patients: state.patients,
        history: state.history,
      }),
      skipHydration: true,
    },
  ),
)
