"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { PlanHistoryDialog } from "@/components/patient/plan-history-dialog"
import { Badge } from "@/components/ui/badge"
import { CARE_PLAN_STATUS_LABEL } from "@/features/care-plan/labels"
import type { CarePlan } from "@/features/care-plan/types"
import { formatDate } from "@/lib/date"

type ProfileHistoryPanelProps = {
  plans: CarePlan[]
}

export function ProfileHistoryPanel({ plans }: ProfileHistoryPanelProps) {
  const [viewedPlan, setViewedPlan] = useState<CarePlan | null>(null)

  if (plans.length === 0) return <p className="type-caption">Belum ada riwayat care plan.</p>

  return (
    <>
      <ul className="divide-y">
        {plans.map((plan) => (
          <li key={plan.id}>
            <button
              type="button"
              onClick={() => setViewedPlan(plan)}
              className="flex min-h-16 w-full items-center justify-between gap-3 py-4 text-left transition-colors hover:bg-muted/60"
            >
              <div>
                <p className="font-medium">Versi {plan.version}</p>
                <p className="type-caption">{plan.confirmedAt ? `Dikonfirmasi ${formatDate(plan.confirmedAt)}` : "Belum dikonfirmasi"}</p>
              </div>
              <span className="flex items-center gap-2">
                <Badge variant={plan.status === "active" ? "default" : "outline"}>{CARE_PLAN_STATUS_LABEL[plan.status]}</Badge>
                <ChevronRight className="size-4 text-muted-foreground" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <PlanHistoryDialog plan={viewedPlan} onClose={() => setViewedPlan(null)} />
    </>
  )
}
