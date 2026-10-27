"use client"

import { X } from "lucide-react"

import { RingOrnament } from "@/components/ring-ornament"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { getItemSummary, getItemTitle } from "@/features/care-plan/describe"
import { CARE_PLAN_ITEM_KIND_LABEL, CARE_PLAN_KIND_ORDER, CARE_PLAN_STATUS_LABEL } from "@/features/care-plan/labels"
import { selectItemsByKind } from "@/features/care-plan/selectors"
import type { CarePlan } from "@/features/care-plan/types"
import { selectDoctorById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import { formatDate } from "@/lib/date"

type PlanHistoryDialogProps = {
  plan: CarePlan | null
  onClose: () => void
}

export function PlanHistoryDialog({ plan, onClose }: PlanHistoryDialogProps) {
  const doctors = usePatientStore((state) => state.doctors)
  const doctor = plan ? selectDoctorById(doctors, plan.createdBy) : undefined

  return (
    <Dialog open={plan !== null} onOpenChange={(isOpen) => (isOpen ? undefined : onClose())}>
      <DialogContent showCloseButton={false} className="max-h-dvh gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-lg">
        {plan ? (
          <>
            <header className="relative overflow-hidden bg-primary p-6 pr-16 text-primary-foreground md:p-8 md:pr-20">
              <RingOrnament />
              <DialogClose asChild>
                <Button variant="ghost" size="icon" aria-label="Tutup" className="absolute top-4 right-4 size-11 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">
                  <X />
                </Button>
              </DialogClose>
              <span className="relative rounded-full bg-primary-foreground px-3 py-0.5 text-xs font-semibold text-primary">
                {CARE_PLAN_STATUS_LABEL[plan.status]}
              </span>
              <DialogTitle className="relative mt-4 text-3xl font-semibold tracking-tight text-primary-foreground">Care plan versi {plan.version}</DialogTitle>
              <DialogDescription className="relative mt-1 text-base text-primary-foreground/80">
                {doctor ? `${doctor.name} · ` : ""}
                {plan.confirmedAt ? `Dikonfirmasi ${formatDate(plan.confirmedAt)}` : "Belum dikonfirmasi"}
              </DialogDescription>
            </header>

            <div className="space-y-6 p-6 md:p-8">
              <section className="space-y-2">
                <h3 className="type-overline">Catatan dokter</h3>
                <p className="text-base leading-relaxed">{plan.sourceText}</p>
              </section>
              {CARE_PLAN_KIND_ORDER.map((kind) => {
                const items = selectItemsByKind(plan, kind)
                if (items.length === 0) return null
                return (
                  <section key={kind} className="space-y-2">
                    <h3 className="type-overline">{CARE_PLAN_ITEM_KIND_LABEL[kind]}</h3>
                    <ul className="divide-y rounded-2xl border">
                      {items.map((item) => (
                        <li key={item.id} className="px-4 py-3">
                          <p className="type-body font-medium">{getItemTitle(item)}</p>
                          <p className="type-caption">{getItemSummary(item)}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
              {plan.status === "superseded" ? <p className="type-caption">Versi lama, hanya bisa dibaca. Jadwal kamu mengikuti versi yang aktif.</p> : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
