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
          <DialogTitle>Cancel this consultation?</DialogTitle>
          <DialogDescription>
            {consultation ? `The consultation with ${patientName} on ${formatDateTime(consultation.startsAt)} will be cancelled.` : null}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="cancel-reason">Cancellation reason (optional)</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            maxLength={REASON_MAX_LENGTH}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Example: doctor is unavailable"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep it
          </Button>
          <Button type="button" variant="destructive" onClick={() => onConfirm(reason)}>
            Cancel consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
