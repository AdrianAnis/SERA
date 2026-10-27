import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { FeedbackEntry, ReminderCompletion } from "@/features/feedback/types"
import { mockCompletions, mockFeedbackEntries } from "@/mocks/activity"

const FEEDBACK_STORAGE_KEY = "hc:feedback"

type FeedbackState = {
  completions: Record<string, ReminderCompletion>
  entries: FeedbackEntry[]
  toggleCompletion: (key: string) => void
  addFeedback: (input: Pick<FeedbackEntry, "patientId" | "category" | "message">) => void
  resolveFeedback: (feedbackId: string) => void
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      completions: mockCompletions,
      entries: mockFeedbackEntries,
      toggleCompletion: (key) =>
        set((state) => {
          const { [key]: existing, ...rest } = state.completions
          if (existing) return { completions: rest }
          return { completions: { ...rest, [key]: { key, completedAt: new Date().toISOString() } } }
        }),
      addFeedback: (input) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...input, id: `fb-${input.patientId}-${Date.now()}`, status: "open", createdAt: new Date().toISOString() },
          ],
        })),
      resolveFeedback: (feedbackId) =>
        set((state) => ({
          entries: state.entries.map((entry) => (entry.id === feedbackId ? { ...entry, status: "resolved" } : entry)),
        })),
    }),
    {
      name: FEEDBACK_STORAGE_KEY,
      version: 3,
      migrate: () => ({ completions: mockCompletions, entries: mockFeedbackEntries }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ completions: state.completions, entries: state.entries }),
      skipHydration: true,
    },
  ),
)
