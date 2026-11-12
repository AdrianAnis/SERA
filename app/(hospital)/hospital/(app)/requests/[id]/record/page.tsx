import type { Metadata } from "next"
import { CreateRecordView } from "@/components/hospital/create-record-view"

export const metadata: Metadata = {
  title: "Formulir Rekam Medis Baru | Sera",
  description: "Terbitkan nomor rekam medis dan data klinis awal pasien baru.",
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function RequestRecordPage({ params }: PageProps) {
  const { id } = await params
  return <CreateRecordView requestId={id} />
}

