import type { Metadata } from "next"
import { DoctorSearchView } from "@/components/patient/doctor-search-view"

export const metadata: Metadata = {
  title: "Cari Dokter | Sera",
  description: "Cari dan temukan dokter spesialis terpercaya untuk konsultasi dan pemantauan care plan.",
}

export default function DoctorsPage() {
  return <DoctorSearchView />
}

