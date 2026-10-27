import { differenceInYears } from "date-fns"

import type { Doctor, HealthHistoryEntry, Patient } from "@/features/patient/types"
import { toDate } from "@/lib/date"

export function selectPatientById(patients: Patient[], patientId: string): Patient | undefined {
  return patients.find((patient) => patient.id === patientId)
}

export function selectPatientHistory(history: HealthHistoryEntry[], patientId: string): HealthHistoryEntry[] {
  return history
    .filter((entry) => entry.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function selectPatientAge(patient: Patient, today: Date): number {
  return differenceInYears(today, toDate(patient.birthDate))
}

export function selectFirstName(patient: Patient): string {
  return patient.name.split(" ")[0] ?? patient.name
}

export function selectDoctorById(doctors: Doctor[], doctorId: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.id === doctorId)
}

export function selectHonorific(patient: Patient): string {
  return patient.gender === "male" ? "Pak" : "Bu"
}
