"use client"

import { Minus, Pencil, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PlanChange, PlanChangeType } from "@/features/care-plan/diff"

type ConfirmPlanDialogProps = {
  isOpen: boolean
  versionLabel: string
  patientName: string
  changes: PlanChange[]
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}

const CHANGE_STYLE: Record<PlanChangeType, { label: string; icon: typeof Plus; className: string }> = {
  added: { label: "Ditambah", icon: Plus, className: "bg-success/15 text-success" },
  changed: { label: "Diubah", icon: Pencil, className: "bg-warning/20 text-warning-foreground" },
  removed: { label: "Dihapus", icon: Minus, className: "bg-destructive/10 text-destructive" },
}

export function ConfirmPlanDialog({ isOpen, versionLabel, patientName, changes, onOpenChange, onConfirm }: ConfirmPlanDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-dvh gap-4 overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Selesaikan sesi dan kirim care plan {versionLabel}</DialogTitle>
          <DialogDescription>
            Setelah sesi diselesaikan, versi ini langsung aktif untuk {patientName} dan menggantikan versi sebelumnya.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium">Ringkasan perubahan</p>
          {changes.length === 0 ? (
            <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Tidak ada perubahan dibanding versi aktif.</p>
          ) : (
            <ul className="space-y-2">
              {changes.map((change) => {
                const style = CHANGE_STYLE[change.type]
                const Icon = style.icon
                return (
                  <li key={`${change.type}-${change.title}`} className="flex gap-3 rounded-md border p-3">
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-md ${style.className}`}>
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">
                        {style.label}: {change.title}
                      </p>
                      {change.details.map((detail) => (
                        <p key={detail} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Periksa lagi
          </Button>
          <Button type="button" onClick={onConfirm}>
            Selesaikan sesi dan kirim ke pasien
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
