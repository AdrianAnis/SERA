import type { Metadata } from "next"
import { RequestsView } from "@/components/hospital/requests-view"

export const metadata: Metadata = {
  title: "Consultation Requests | Sera Clinician Workspace",
  description: "Manage consultation requests from prospective patients.",
}

export default function RequestsPage() {
  return <RequestsView />
}

