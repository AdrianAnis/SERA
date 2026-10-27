import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { selectPatientPlans } from "@/features/care-plan/selectors"
import type { CarePlan, CarePlanInput } from "@/features/care-plan/types"
import { mockAcknowledgedPlanIds, mockCarePlans } from "@/mocks/care-plans"

const CARE_PLAN_STORAGE_KEY = "hc:care-plan"

type CarePlanState = {
  plans: CarePlan[]
  acknowledgedPlanIds: Record<string, string>
  publishPlan: (input: CarePlanInput) => void
  acknowledgePlan: (patientId: string, planId: string) => void
}

function supersedeActivePlan(plan: CarePlan): CarePlan {
  return plan.status === "active" ? { ...plan, status: "superseded" } : plan
}

export const useCarePlanStore = create<CarePlanState>()(
  persist(
    (set, get) => ({
      plans: mockCarePlans,
      acknowledgedPlanIds: mockAcknowledgedPlanIds,
      publishPlan: (input) => {
        const publishedAt = new Date().toISOString()
        const latestVersion = Math.max(0, ...selectPatientPlans(get().plans, input.patientId).map((plan) => plan.version))
        const publishedPlan: CarePlan = {
          ...input,
          id: `cp-${input.patientId}-v${latestVersion + 1}`,
          version: latestVersion + 1,
          status: "active",
          createdAt: publishedAt,
          confirmedAt: publishedAt,
        }
        set((state) => ({
          plans: [...state.plans.map((plan) => (plan.patientId === input.patientId ? supersedeActivePlan(plan) : plan)), publishedPlan],
        }))
      },
      acknowledgePlan: (patientId, planId) =>
        set((state) => ({ acknowledgedPlanIds: { ...state.acknowledgedPlanIds, [patientId]: planId } })),
    }),
    {
      name: CARE_PLAN_STORAGE_KEY,
      version: 4,
      migrate: () => ({ plans: mockCarePlans, acknowledgedPlanIds: mockAcknowledgedPlanIds }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ plans: state.plans, acknowledgedPlanIds: state.acknowledgedPlanIds }),
      skipHydration: true,
    },
  ),
)
