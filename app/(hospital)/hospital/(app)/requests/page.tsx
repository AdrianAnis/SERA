import type { Metadata } from "next"
import { RequestsView } from "@/components/hospital/requests-view"

export const metadata: Metadata = {
  title: "Permintaan Konsultasi | Sera Clinician Workspace",
  description: "Kelola permintaan konsultasi dari calon pasien.",
}

export default function RequestsPage() {
  return <RequestsView />
}

