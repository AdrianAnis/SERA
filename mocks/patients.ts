import type { Doctor, Patient } from "@/features/patient/types"

export const DEMO_DOCTOR_ID = "d-001"

export const DEMO_PATIENT_ID = "p-001"

export const mockDoctors: Doctor[] = [
  {
    id: DEMO_DOCTOR_ID,
    name: "dr. Rina Kartika, Sp.PD",
    specialty: "Penyakit Dalam",
    email: "rina.kartika@rs-sehat.id",
    hospital: "RS Sehat Sentosa",
  },
]

export const mockPatients: Patient[] = [
  {
    id: DEMO_PATIENT_ID,
    mrn: "RM-2024-00187",
    name: "Budi Santoso",
    gender: "male",
    birthDate: "1972-04-12",
    phone: "081234567801",
    guardianName: "Ratna Santoso",
    guardianPhone: "081234567811",
    address: "Jl. Kenanga No. 14, Depok, Jawa Barat",
    primaryDiagnosis: "Hipertensi esensial",
    conditions: ["Hipertensi", "Dislipidemia"],
    allergies: ["Sulfa"],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
  {
    id: "p-002",
    mrn: "RM-2023-01452",
    name: "Siti Rahmawati",
    gender: "female",
    birthDate: "1979-09-03",
    phone: "081234567802",
    guardianName: "Hendra Rahmawan",
    guardianPhone: "081234567812",
    address: "Jl. Melati Raya No. 7, Bekasi, Jawa Barat",
    primaryDiagnosis: "Diabetes melitus tipe 2",
    conditions: ["Diabetes melitus tipe 2", "Obesitas derajat I"],
    allergies: [],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
  {
    id: "p-003",
    mrn: "RM-2025-00932",
    name: "Andi Pratama",
    gender: "male",
    birthDate: "1994-12-21",
    phone: "081234567803",
    guardianName: "Sulastri Pratama",
    guardianPhone: "081234567813",
    address: "Jl. Cempaka Putih No. 22, Jakarta Pusat",
    primaryDiagnosis: "Pemulihan pasca operasi usus buntu",
    conditions: ["Apendisitis akut, pasca operasi"],
    allergies: ["Amoksisilin"],
    assignedDoctorId: DEMO_DOCTOR_ID,
  },
]
