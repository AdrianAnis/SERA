import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CarePlan } from "@/features/care-plan/types"
import { answerQuestion } from "@/features/companion/scenarios"
import type { ChatMessage } from "@/features/companion/types"
import { mockCompanionThreads } from "@/mocks/companion"

const COMPANION_STORAGE_KEY = "hc:companion"

type CompanionState = {
  threads: Record<string, ChatMessage[]>
  askQuestion: (patientId: string, question: string, activePlan: CarePlan | undefined) => void
  reportMessage: (patientId: string, messageId: string) => void
}

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set) => ({
      threads: mockCompanionThreads,
      askQuestion: (patientId, question, activePlan) =>
        set((state) => {
          const now = new Date()
          const answer = answerQuestion(question, activePlan, now)
          const createdAt = now.toISOString()
          const patientMessage: ChatMessage = {
            id: `msg-${now.getTime()}-q`,
            role: "patient",
            content: question.trim(),
            createdAt,
            scope: answer.scope,
            source: null,
            isReported: false,
          }
          const companionMessage: ChatMessage = {
            id: `msg-${now.getTime()}-a`,
            role: "companion",
            content: answer.content,
            createdAt,
            scope: answer.scope,
            source: answer.source,
            isReported: false,
          }
          return {
            threads: {
              ...state.threads,
              [patientId]: [...(state.threads[patientId] ?? []), patientMessage, companionMessage],
            },
          }
        }),
      reportMessage: (patientId, messageId) =>
        set((state) => ({
          threads: {
            ...state.threads,
            [patientId]: (state.threads[patientId] ?? []).map((message) =>
              message.id === messageId ? { ...message, isReported: true } : message,
            ),
          },
        })),
    }),
    {
      name: COMPANION_STORAGE_KEY,
      version: 2,
      migrate: () => ({ threads: mockCompanionThreads }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ threads: state.threads }),
      skipHydration: true,
    },
  ),
)
