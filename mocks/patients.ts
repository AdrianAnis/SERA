import type { Doctor, Patient } from "@/features/patient/types"

export const DEMO_DOCTOR_ID = "d-001"

export const DEMO_PATIENT_ID = "p-001"

export const mockDoctors: Doctor[] = [
  {
    id: DEMO_DOCTOR_ID,
    name: "Dr. Haruka Tanaka, MD",
    specialty: "Internal Medicine",
    email: "haruka.tanaka@gmail.com",
    hospital: "Sakura General Hospital",
  },
]

export const mockPatients: Patient[] = [
  {
    id: DEMO_PATIENT_ID,
    mrn: "RM-2024-00187",
    name: "Takeshi Sato",
    gender: "male",
    birthDate: "1972-04-12",
    phone: "081234567801",
    guardianName: "Yuki Sato",
    guardianPhone: "081234567811",
    address: "14 Kenanga Street, Depok, West Java",
    primaryDiagnosis: "Essential hypertension",
    conditions: ["Hypertension", "Dyslipidemia"],
    allergies: ["Sulfa drugs"],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
  {
    id: "p-002",
    mrn: "RM-2023-01452",
    name: "Aiko Nakamura",
    gender: "female",
    birthDate: "1979-09-03",
    phone: "081234567802",
    guardianName: "Hiroshi Nakamura",
    guardianPhone: "081234567812",
    address: "7 Melati Raya Street, Bekasi, West Java",
    primaryDiagnosis: "Type 2 diabetes mellitus",
    conditions: ["Type 2 diabetes mellitus", "Class I obesity"],
    allergies: [],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
  {
    id: "p-003",
    mrn: "RM-2025-00932",
    name: "Renji Yamamoto",
    gender: "male",
    birthDate: "1994-12-21",
    phone: "081234567803",
    guardianName: "Emiko Yamamoto",
    guardianPhone: "081234567813",
    address: "22 Cempaka Putih Street, Central Jakarta",
    primaryDiagnosis: "Post-appendectomy recovery",
    conditions: ["Acute appendicitis, post-surgery"],
    allergies: ["Amoxicillin"],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
]
