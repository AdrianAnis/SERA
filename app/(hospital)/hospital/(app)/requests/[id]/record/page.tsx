import type { Metadata } from "next"
import { CreateRecordView } from "@/components/hospital/create-record-view"

export const metadata: Metadata = {
  title: "New Medical Record Form | Sera",
  description: "Issue a medical record number and initial clinical data for a new patient.",
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function RequestRecordPage({ params }: PageProps) {
  const { id } = await params
  return <CreateRecordView requestId={id} />
}

