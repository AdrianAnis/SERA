import type { CarePlan } from "@/features/care-plan/types"
import { classifyQuestion, isSymptomComplaint } from "@/features/companion/scope"
import type { ChatMessage, CompanionTopic, ConversationCategory, ConversationEntry, ConversationSummary } from "@/features/companion/types"

export type EscalatedQuestion = {
  question: ChatMessage
  answer: ChatMessage
}

export function selectThread(threads: Record<string, ChatMessage[]>, patientId: string): ChatMessage[] {
  return threads[patientId] ?? []
}

export function selectEscalatedQuestions(thread: ChatMessage[]): EscalatedQuestion[] {
  return thread.flatMap((message, index) => {
    const question = thread[index - 1]
    const isEscalatedAnswer = message.role === "companion" && message.scope !== "in-scope" && message.scope !== null
    return isEscalatedAnswer && question ? [{ question, answer: message }] : []
  })
}

const CATEGORY_BY_TOPIC: Record<CompanionTopic, ConversationCategory> = {
  "medication-today": "medication",
  "medication-detail": "medication",
  diet: "diet",
  activity: "activity",
  "follow-up": "follow-up",
  "explain-plan": "plan-explanation",
  "missed-dose": "missed-dose",
  "consultation-request": "consultation-request",
  "complaint-intake": "complaint",
  none: "other",
}

function toConversationEntry(message: ChatMessage, activePlan: CarePlan | undefined): ConversationEntry {
  const { scope, topic } = classifyQuestion(message.content, activePlan)
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    category: isSymptomComplaint(message.content) ? "complaint" : CATEGORY_BY_TOPIC[topic],
    scope,
  }
}

export function selectConversationSummary(thread: ChatMessage[], activePlan: CarePlan | undefined): ConversationSummary {
  const entries = thread
    .filter((message) => message.role === "patient")
    .map((message) => toConversationEntry(message, activePlan))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const countsByCategory = entries.reduce<Map<ConversationCategory, number>>(
    (counts, entry) => counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1),
    new Map(),
  )

  return {
    totalMessages: entries.length,
    escalatedCount: entries.filter((entry) => entry.scope !== "in-scope").length,
    categoryCounts: [...countsByCategory.entries()].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
    entries,
  }
}
