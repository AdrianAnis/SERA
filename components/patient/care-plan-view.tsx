"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { CARE_PLAN_KIND_ICON } from "@/components/care-plan-kind-icons"
import { CarePlanItemDialog } from "@/components/patient/care-plan-item-dialog"
import { EmptyState } from "@/components/patient/empty-state"
import { PageSkeleton } from "@/components/patient/page-skeleton"
import { PeekingMascot } from "@/components/patient/peeking-mascot"
import { PlanUpdateBanner } from "@/components/patient/plan-update-banner"
import { RingOrnament } from "@/components/ring-ornament"
import { Badge } from "@/components/ui/badge"
import { getItemSummary, getItemTitle } from "@/features/care-plan/describe"
import { CARE_PLAN_ITEM_KIND_LABEL, CARE_PLAN_KIND_ORDER } from "@/features/care-plan/labels"
import { selectItemsByKind } from "@/features/care-plan/selectors"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { formatDateTime } from "@/lib/date"
import { routes } from "@/lib/routes"


export function CarePlanView() {
  const { isHydrated, patient, activePlan, activeDoctor } = usePatientContext()

  if (!isHydrated || !patient) return <PageSkeleton />

  if (!activePlan) {
    return (
      <EmptyState
        title="Belum ada care plan aktif"
        description="Care plan akan muncul di sini setelah dokter mengonfirmasinya."
      />
    )
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="type-title">Care plan saya</h1>
        <p className="text-muted-foreground">Instruksi aktif dari dokter kamu, dikelompokkan per kategori.</p>
      </header>

      <PlanUpdateBanner />

      <section className="relative grid gap-5 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:grid-cols-3 md:p-8">
        <RingOrnament />
        <PeekingMascot />
        <PlanFact label="Dokter">
          <p className="font-medium">{activeDoctor?.name ?? "-"}</p>
          {activeDoctor ? <p className="text-sm text-primary-foreground/80">{activeDoctor.hospital}</p> : null}
        </PlanFact>
        <PlanFact label="Versi">
          <div className="flex items-center gap-2">
            <p className="font-medium">Versi {activePlan.version}</p>
            <Badge className="bg-primary-foreground text-primary">Aktif</Badge>
          </div>
        </PlanFact>
        <PlanFact label="Berlaku sejak">
          <p className="font-medium">{activePlan.confirmedAt ? formatDateTime(activePlan.confirmedAt) : "-"}</p>
        </PlanFact>
      </section>

      <div className="columns-1 gap-6 md:columns-2">
        {CARE_PLAN_KIND_ORDER.map((kind) => {
          const items = selectItemsByKind(activePlan, kind)
          if (items.length === 0) return null
          const KindIcon = CARE_PLAN_KIND_ICON[kind]
          return (
            <section key={kind} className="mb-6 break-inside-avoid overflow-hidden rounded-3xl border bg-card shadow-sm">
              <h2 className="flex items-center gap-3 border-b bg-muted/40 px-5 py-4 type-heading">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KindIcon className="size-5" />
                </span>
                {CARE_PLAN_ITEM_KIND_LABEL[kind]}
                <span className="ml-auto rounded-full bg-background px-2.5 py-0.5 text-sm font-medium text-muted-foreground">{items.length}</span>
              </h2>
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={routes.patient.carePlanItem(item.id)}
                      className="flex min-h-16 items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{getItemTitle(item)}</p>
                        <p className="type-caption">{getItemSummary(item)}</p>
                      </div>
                      <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
      <Suspense fallback={null}>
        <CarePlanItemDialog />
      </Suspense>
    </div>
  )
}

type PlanFactProps = {
  label: string
  children: React.ReactNode
}

function PlanFact({ label, children }: PlanFactProps) {
  return (
    <div className="relative space-y-1">
      <p className="type-overline text-primary-foreground/70">{label}</p>
      {children}
    </div>
  )
}
