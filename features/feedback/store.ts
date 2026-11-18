import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { FeedbackEntry, ReminderCompletion } from "@/features/feedback/types"
import { feedbackApi, reminderApi } from "@/lib/api"
import { mockCompletions, mockFeedbackEntries } from "@/mocks/activity"

const FEEDBACK_STORAGE_KEY = "hc:feedback"

type ToggleReminderMeta = {
  itemId?: string
  kind?: "medication" | "activity"
  date?: string
  time?: string | null
}

type FeedbackState = {
  completions: Record<string, ReminderCompletion>
  entries: FeedbackEntry[]
  toggleCompletion: (
    key: string,
    meta?: ToggleReminderMeta,
    token?: string
  ) => void
  addFeedback: (
    input: Pick<FeedbackEntry, "patientId" | "category" | "message">,
    token?: string
  ) => Promise<void>
  resolveFeedback: (
    feedbackId: string,
    patientId?: string,
    token?: string
  ) => Promise<void>
  fetchHospitalFeedbacks: (patientId: string, token?: string) => Promise<void>
  fetchPatientFeedbacks: (token: string) => Promise<void>
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      completions: mockCompletions,
      entries: mockFeedbackEntries,

      toggleCompletion: (key, meta, token) => {
        const completedAt = new Date().toISOString()
        const existing = get().completions[key]

        // Optimistic UI toggle
        set((state) => {
          const { [key]: _, ...rest } = state.completions
          if (existing) return { completions: rest }
          return { completions: { ...rest, [key]: { key, completedAt } } }
        })

        if (token) {
          const parts = key.split(":")
          const itemId = meta?.itemId || parts[0] || "item-1"
          const fallbackDate = new Date().toISOString().split("T")[0]!
          const date = meta?.date || parts[1] || fallbackDate
          const rawTime = meta?.time !== undefined ? meta.time : (parts[2] === "anytime" ? null : parts[2])
          const kind = meta?.kind || (key.includes("anytime") ? "activity" : "medication")

          void reminderApi
            .toggleReminder(
              {
                key,
                itemId,
                kind,
                date,
                time: rawTime || null,
              },
              token
            )
            .catch((err) => {
              console.error("[useFeedbackStore] Failed to toggle reminder on backend:", err)
            })
        }
      },

      addFeedback: async (input, token) => {
        const tempId = `fb-${input.patientId}-${Date.now()}`
        const localEntry: FeedbackEntry = {
          ...input,
          id: tempId,
          status: "open",
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          entries: [...state.entries, localEntry],
        }))

        if (token) {
          try {
            const created = await feedbackApi.createFeedback(
              { category: input.category, message: input.message },
              token
            )
            if (created) {
              set((state) => ({
                entries: state.entries.map((e) => (e.id === tempId ? created : e)),
              }))
            }
          } catch (err) {
            console.error("[useFeedbackStore] Failed to save feedback on backend:", err)
          }
        }
      },

      resolveFeedback: async (feedbackId, patientId, token) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === feedbackId ? { ...entry, status: "resolved" } : entry
          ),
        }))

        if (token && patientId) {
          try {
            await feedbackApi.resolveFeedback(patientId, feedbackId, token)
          } catch (err) {
            console.error("[useFeedbackStore] Failed to resolve feedback on backend:", err)
          }
        }
      },

      fetchHospitalFeedbacks: async (patientId, token) => {
        try {
          const remoteFeedbacks = await feedbackApi.getHospitalPatientFeedbacks(patientId, token)
          if (remoteFeedbacks) {
            set((state) => {
              const remoteIds = new Set(remoteFeedbacks.map((f) => f.id))
              const otherEntries = state.entries.filter(
                (f) => f.patientId !== patientId && !remoteIds.has(f.id)
              )
              return { entries: [...otherEntries, ...remoteFeedbacks] }
            })
          }
        } catch (err) {
          console.error("[useFeedbackStore] Failed to fetch hospital feedbacks:", err)
        }
      },

      fetchPatientFeedbacks: async (token) => {
        try {
          const remoteFeedbacks = await feedbackApi.getPatientFeedbacks(token)
          if (remoteFeedbacks) {
            set((state) => {
              const remoteIds = new Set(remoteFeedbacks.map((f) => f.id))
              const otherEntries = state.entries.filter((f) => !remoteIds.has(f.id))
              return { entries: [...otherEntries, ...remoteFeedbacks] }
            })
          }
        } catch (err) {
          console.error("[useFeedbackStore] Failed to fetch patient feedbacks:", err)
        }
      },
    }),
    {
      name: FEEDBACK_STORAGE_KEY,
      version: 4,
      migrate: () => ({ completions: mockCompletions, entries: mockFeedbackEntries }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ completions: state.completions, entries: state.entries }),
      skipHydration: true,
    },
  ),
)
