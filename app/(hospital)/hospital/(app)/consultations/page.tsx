import type { Metadata } from "next"

import { ConsultationView } from "@/components/hospital/consultation-view"
import { consultationDateKeySchema } from "@/features/consultation/schema"
import { CONSULTATION_DATE_QUERY_KEY } from "@/lib/routes"

export const metadata: Metadata = { title: "Jadwal Konsultasi" }

export default async function ConsultationsPage({ searchParams }: PageProps<"/hospital/consultations">) {
  const query = await searchParams
  const parsedDate = consultationDateKeySchema.safeParse(query[CONSULTATION_DATE_QUERY_KEY])
  return <ConsultationView initialDateKey={parsedDate.success ? parsedDate.data : undefined} />
}
