import type { Metadata } from "next"
import { DoctorProfileView } from "@/components/patient/doctor-profile-view"

export const metadata: Metadata = {
  title: "Profil Dokter | Sera",
  description: "Lihat profil dokter spesialis dan ajukan konsultasi kesehatan digital.",
}

export default function DoctorDetailPage() {
  return <DoctorProfileView />
}

