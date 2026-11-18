import { notFound } from "next/navigation"

export default function CarePlanPage() {
  notFound()
}

/*
import type { Metadata } from "next"

import { CarePlanView } from "@/components/patient/care-plan-view"

export const metadata: Metadata = { title: "Care Plan" }

export default function CarePlanPage() {
  return <CarePlanView />
}
*/
