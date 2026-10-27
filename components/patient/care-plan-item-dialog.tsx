"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MessageCircleHeart, X } from "lucide-react"

import { RingOrnament } from "@/components/ring-ornament"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { getItemDetailRows, getItemSummary, getItemTitle } from "@/features/care-plan/describe"
import { CARE_PLAN_ITEM_KIND_LABEL } from "@/features/care-plan/labels"
import { selectPlanItem } from "@/features/care-plan/selectors"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { cn } from "@/lib/utils"
import { ITEM_QUERY_KEY, routes } from "@/lib/routes"

const LONG_VALUE_LENGTH = 18

export function CarePlanItemDialog() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { activePlan } = usePatientContext()

  const itemId = searchParams.get(ITEM_QUERY_KEY)
  const item = itemId ? selectPlanItem(activePlan, itemId) : undefined

  function handleOpenChange(isOpen: boolean): void {
    if (!isOpen) router.replace(pathname, { scroll: false })
  }

  return (
    <Dialog open={item !== undefined} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="max-h-dvh gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-lg">
        {item && activePlan ? (
          <>
            <header className="relative overflow-hidden bg-primary p-6 pr-16 text-primary-foreground md:p-8 md:pr-20">
              <RingOrnament />
              <DialogClose asChild>
                <Button variant="ghost" size="icon" aria-label="Tutup" className="absolute top-4 right-4 size-11 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">
                  <X />
                </Button>
              </DialogClose>
              <span className="relative rounded-full bg-primary-foreground px-3 py-0.5 text-xs font-semibold text-primary">
                {CARE_PLAN_ITEM_KIND_LABEL[item.kind]}
              </span>
              <DialogTitle className="relative mt-4 text-3xl font-semibold tracking-tight text-primary-foreground">{getItemTitle(item)}</DialogTitle>
              <DialogDescription className="relative mt-1 text-base text-primary-foreground/80">{getItemSummary(item)}</DialogDescription>
            </header>

            <div className="space-y-6 p-6 md:p-8">
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {getItemDetailRows(item).map((row) => (
                  <div key={row.label} className={cn("space-y-1.5", row.value.length > LONG_VALUE_LENGTH && "sm:col-span-2")}>
                    <dt className="type-overline">{row.label}</dt>
                    <dd className="text-base font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-2xl bg-muted p-5">
                <p className="type-overline">Catatan asli dokter</p>
                <p className="mt-2 text-sm leading-relaxed">{activePlan.sourceText}</p>
              </div>

              <Button asChild size="lg" className="h-12 w-full">
                <Link href={routes.patient.companion}>
                  <MessageCircleHeart />
                  Tanya Companion soal ini
                </Link>
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
