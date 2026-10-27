"use client"

import Link from "next/link"
import { Info, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePlanUpdate } from "@/features/care-plan/use-plan-update"
import { routes } from "@/lib/routes"

export function PlanUpdateBanner() {
  const { updatedPlan, doctorName, acknowledge } = usePlanUpdate()

  if (!updatedPlan) return null

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/15 p-4 text-warning-foreground"
    >
      <Info className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">Care plan kamu diperbarui oleh {doctorName ?? "dokter"}</p>
        <p className="text-sm">Sekarang kamu memakai versi {updatedPlan.version}. Jadwal hari ini sudah menyesuaikan.</p>
        <Button asChild variant="link" className="mt-1 h-auto p-0 text-warning-foreground underline">
          <Link href={routes.patient.carePlan} onClick={acknowledge}>
            Lihat care plan terbaru
          </Link>
        </Button>
      </div>
      <Button variant="ghost" size="icon" className="size-11" aria-label="Tutup pemberitahuan" onClick={acknowledge}>
        <X />
      </Button>
    </div>
  )
}
