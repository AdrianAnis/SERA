import type { Metadata } from "next"

import { TodayView } from "@/components/patient/today-view"

export const metadata: Metadata = { title: "Hari Ini" }

export default function TodayPage() {
  return <TodayView />
}
