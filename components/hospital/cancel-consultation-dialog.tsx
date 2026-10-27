"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Consultation } from "@/features/consultation/types"
import { formatDateTime } from "@/lib/date"

const REASON_MAX_LENGTH = 200

type CancelConsultationDialogProps = {
  consultation: Consultation | null
  patientName: string
  onOpenChange: (isOpen: boolean) => void
  onConfirm: (reason: string) => void
}

export function CancelConsultationDialog({ consultation, patientName, onOpenChange, onConfirm }: CancelConsultationDialogProps) {
  const [reason, setReason] = useState("")

  return (
    <Dialog open={consultation !== null} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batalkan jadwal konsultasi?</DialogTitle>
          <DialogDescription>
            {consultation ? `Konsultasi ${patientName} pada ${formatDateTime(consultation.startsAt)} akan dibatalkan.` : null}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="cancel-reason">Alasan pembatalan (opsional)</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            maxLength={REASON_MAX_LENGTH}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Contoh: dokter berhalangan hadir"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Tidak jadi
          </Button>
          <Button type="button" variant="destructive" onClick={() => onConfirm(reason)}>
            Batalkan jadwal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
