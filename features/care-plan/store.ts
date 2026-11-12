import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { selectPatientPlans } from "@/features/care-plan/selectors"
import type { CarePlan, CarePlanInput } from "@/features/care-plan/types"
import { carePlanApi } from "@/lib/api"
import { mockAcknowledgedPlanIds, mockCarePlans } from "@/mocks/care-plans"

const CARE_PLAN_STORAGE_KEY = "hc:care-plan"

type CarePlanState = {
  plans: CarePlan[]
  acknowledgedPlanIds: Record<string, string>
  isLoading: boolean
  error: string | null
  publishPlan: (input: CarePlanInput, token?: string) => Promise<CarePlan>
  acknowledgePlan: (patientId: string, planId: string, token?: string) => Promise<void>
  fetchPatientActivePlan: (token: string) => Promise<CarePlan | null>
  fetchPatientPlans: (token: string) => Promise<void>
  fetchHospitalPlans: (patientId: string, token?: string) => Promise<void>
}

function supersedeActivePlan(plan: CarePlan): CarePlan {
  return plan.status === "active" ? { ...plan, status: "superseded" } : plan
}

export const useCarePlanStore = create<CarePlanState>()(
  persist(
    (set, get) => ({
      plans: mockCarePlans,
      acknowledgedPlanIds: mockAcknowledgedPlanIds,
      isLoading: false,
      error: null,

      publishPlan: async (input, token) => {
        const publishedAt = new Date().toISOString()
        const latestVersion = Math.max(0, ...selectPatientPlans(get().plans, input.patientId).map((plan) => plan.version))
        const localPlan: CarePlan = {
          ...input,
          id: `cp-${input.patientId}-v${latestVersion + 1}`,
          version: latestVersion + 1,
          status: "active",
          createdAt: publishedAt,
          confirmedAt: publishedAt,
        }

        // Optimistic local update
        set((state) => ({
          plans: [...state.plans.map((plan) => (plan.patientId === input.patientId ? supersedeActivePlan(plan) : plan)), localPlan],
        }))

        try {
          const res = await carePlanApi.publishPlan(
            input.patientId,
            { sourceText: input.sourceText, items: input.items, autoConfirm: true },
            token
          )
          if (res?.plan) {
            set((state) => ({
              plans: [...state.plans.filter((p) => p.id !== localPlan.id && p.id !== res.plan.id), res.plan],
            }))
            return res.plan
          }
        } catch (err) {
          console.error("Gagal menyimpan care plan ke backend:", err)
        }

        return localPlan
      },

      acknowledgePlan: async (patientId, planId, token) => {
        set((state) => ({
          acknowledgedPlanIds: { ...state.acknowledgedPlanIds, [patientId]: planId },
        }))

        if (token) {
          try {
            await carePlanApi.acknowledgePlan(planId, token)
          } catch (err) {
            console.error("Gagal mengirim konfirmasi acknowledge ke backend:", err)
          }
        }
      },

      fetchPatientActivePlan: async (token) => {
        try {
          const activePlan = await carePlanApi.getPatientActivePlan(token)
          if (activePlan) {
            set((state) => {
              const others = state.plans.filter(
                (p) => !(p.patientId === activePlan.patientId && (p.id === activePlan.id || p.status === "active"))
              )
              const superseded = state.plans
                .filter((p) => p.patientId === activePlan.patientId && p.id !== activePlan.id && p.status === "active")
                .map(supersedeActivePlan)

              return {
                plans: [...others, ...superseded, activePlan],
              }
            })
            return activePlan
          }
          return null
        } catch (err) {
          console.error("Gagal mengambil active care plan pasien:", err)
          return null
        }
      },

      fetchPatientPlans: async (token) => {
        try {
          const patientPlans = await carePlanApi.getPatientCarePlans(token)
          if (patientPlans && patientPlans.length > 0) {
            set((state) => {
              const remoteIds = new Set(patientPlans.map((p) => p.id))
              const rest = state.plans.filter((p) => !remoteIds.has(p.id))
              return { plans: [...rest, ...patientPlans] }
            })
          }
        } catch (err) {
          console.error("Gagal mengambil riwayat care plan pasien:", err)
        }
      },

      fetchHospitalPlans: async (patientId, token) => {
        try {
          const remotePlans = await carePlanApi.getHospitalCarePlans(patientId, token)
          if (remotePlans && remotePlans.length > 0) {
            set((state) => {
              const remoteIds = new Set(remotePlans.map((p) => p.id))
              const nonDuplicateLocal = state.plans.filter((p) => !remoteIds.has(p.id) && p.patientId !== patientId)
              return {
                plans: [...nonDuplicateLocal, ...remotePlans],
              }
            })
          }
        } catch (err) {
          console.error("Gagal mengambil care plans rumah sakit:", err)
        }
      },
    }),
    {
      name: CARE_PLAN_STORAGE_KEY,
      version: 5,
      migrate: () => ({ plans: mockCarePlans, acknowledgedPlanIds: mockAcknowledgedPlanIds, isLoading: false, error: null }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ plans: state.plans, acknowledgedPlanIds: state.acknowledgedPlanIds }),
      skipHydration: true,
    },
  ),
)
