"use client"

import { useEffect } from "react"
import { toast } from "sonner"

import { usePlanUpdate } from "@/features/care-plan/use-plan-update"

export function PlanUpdateToast() {
  const { updatedPlan, doctorName } = usePlanUpdate()
  const updatedPlanId = updatedPlan?.id
  const version = updatedPlan?.version

  useEffect(() => {
    if (!updatedPlanId) return
    toast.info("Care plan kamu diperbarui", {
      id: updatedPlanId,
      description: `${doctorName ?? "Dokter"} memperbarui care plan ke versi ${version}.`,
    })
  }, [updatedPlanId, doctorName, version])

  return null
}
