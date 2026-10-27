import Link from "next/link"
import { CalendarCheck, CalendarX2, TriangleAlert } from "lucide-react"

import { StatusDot, type StatusTone } from "@/components/status-dot"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CONSULTATION_STATUS_LABEL } from "@/features/consultation/labels"
import { selectConsultationEndsAt } from "@/features/consultation/selectors"
import type { Consultation, ConsultationStatus } from "@/features/consultation/types"
import { toTimeKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { getInitials } from "@/lib/utils"

type ConsultationRowProps = {
  consultation: Consultation
  patientName: string
  needsReconfirmation: boolean
  onCancel: (consultation: Consultation) => void
  onReconfirm: (consultation: Consultation) => void
}

const STATUS_TONE: Record<ConsultationStatus, StatusTone> = {
  scheduled: "primary",
  completed: "success",
  cancelled: "destructive",
}

export function ConsultationRow({ consultation, patientName, needsReconfirmation, onCancel, onReconfirm }: ConsultationRowProps) {
  const isCancelled = consultation.status === "cancelled"

  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tabular-nums">
          {toTimeKey(consultation.startsAt)} - {toTimeKey(selectConsultationEndsAt(consultation))}
        </p>
        <StatusDot tone={STATUS_TONE[consultation.status]} label={CONSULTATION_STATUS_LABEL[consultation.status]} />
      </div>
      <Link href={routes.hospital.patientDetail(consultation.patientId)} className="flex items-center gap-3 hover:opacity-80">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{getInitials(patientName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium">{patientName}</p>
          <p className="type-caption">{consultation.topic}</p>
          {isCancelled && consultation.cancelReason ? <p className="type-caption">Alasan: {consultation.cancelReason}</p> : null}
        </div>
      </Link>
      {needsReconfirmation ? (
        <p className="flex items-start gap-2 rounded-lg bg-warning/15 p-3 text-sm text-warning-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Jadwal ini di luar jam konsultasi Anda. Konfirmasi ulang atau batalkan.
        </p>
      ) : null}
      {consultation.status === "scheduled" ? (
        <div className="flex gap-2">
          {needsReconfirmation ? (
            <Button type="button" className="flex-1" onClick={() => onReconfirm(consultation)}>
              <CalendarCheck />
              Konfirmasi ulang
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onCancel(consultation)}
          >
            <CalendarX2 />
            Batalkan jadwal
          </Button>
        </div>
      ) : null}
    </li>
  )
}
