import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CarePlan } from "@/features/care-plan/types"
import { answerQuestion } from "@/features/companion/scenarios"
import type { ChatMessage } from "@/features/companion/types"
import { mockCompanionThreads } from "@/mocks/companion"
import { companionApi } from "@/lib/api"

const COMPANION_STORAGE_KEY = "hc:companion"

type CompanionState = {
  threads: Record<string, ChatMessage[]>
  isLoadingHistory: boolean
  fetchHistory: (patientId: string, token?: string) => Promise<void>
  askQuestion: (
    patientId: string,
    question: string,
    activePlan: CarePlan | undefined,
    token?: string
  ) => Promise<void>
  reportMessage: (patientId: string, messageId: string, token?: string) => Promise<void>
}

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set) => ({
      threads: mockCompanionThreads,
      isLoadingHistory: false,

      fetchHistory: async (patientId: string, token?: string) => {
        if (!token) return
        set({ isLoadingHistory: true })
        try {
          const history = await companionApi.getHistory(token)
          if (Array.isArray(history) && history.length > 0) {
            set((state) => ({
              threads: {
                ...state.threads,
                [patientId]: history,
              },
              isLoadingHistory: false,
            }))
          } else {
            set({ isLoadingHistory: false })
          }
        } catch (err) {
          console.warn("[CompanionStore] Failed to fetch chat history:", err)
          set({ isLoadingHistory: false })
        }
      },

      askQuestion: async (patientId, question, activePlan, token) => {
        const now = new Date()
        const trimmed = question.trim()
        const createdAt = now.toISOString()

        // 1. Optimistically append patient message
        const optimisticPatientMsg: ChatMessage = {
          id: `msg-${now.getTime()}-q`,
          role: "patient",
          content: trimmed,
          createdAt,
          scope: null,
          source: null,
          isReported: false,
        }

        set((state) => ({
          threads: {
            ...state.threads,
            [patientId]: [...(state.threads[patientId] ?? []), optimisticPatientMsg],
          },
        }))

        // 2. Call Backend API if token is provided
        if (token) {
          try {
            const companionMessage = await companionApi.chat(trimmed, token)
            set((state) => ({
              threads: {
                ...state.threads,
                [patientId]: [...(state.threads[patientId] ?? []), companionMessage],
              },
            }))
            return
          } catch (err) {
            console.warn("[CompanionStore] Backend chat API failed, falling back to local engine:", err)
          }
        }

        // 3. Fallback: local deterministic medical engine
        const answer = answerQuestion(trimmed, activePlan, now)
        const companionMessage: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: "companion",
          content: answer.content,
          createdAt: new Date().toISOString(),
          scope: answer.scope,
          source: answer.source,
          isReported: false,
        }

        set((state) => ({
          threads: {
            ...state.threads,
            [patientId]: [...(state.threads[patientId] ?? []), companionMessage],
          },
        }))
      },

      reportMessage: async (patientId, messageId, token) => {
        // 1. Optimistic update
        set((state) => ({
          threads: {
            ...state.threads,
            [patientId]: (state.threads[patientId] ?? []).map((message) =>
              message.id === messageId ? { ...message, isReported: true } : message,
            ),
          },
        }))

        // 2. Backend synchronization
        if (token) {
          try {
            await companionApi.reportMessage(messageId, token)
          } catch (err) {
            console.warn("[CompanionStore] Failed to report message on backend:", err)
          }
        }
      },
    }),
    {
      name: COMPANION_STORAGE_KEY,
      version: 2,
      migrate: () => ({ threads: mockCompanionThreads, isLoadingHistory: false }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ threads: state.threads }),
      skipHydration: true,
    },
  ),
)
