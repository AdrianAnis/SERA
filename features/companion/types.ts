export type QuestionScope = "in-scope" | "out-of-scope" | "urgent"

export type CompanionTopic =
  | "medication-today"
  | "medication-detail"
  | "diet"
  | "activity"
  | "follow-up"
  | "explain-plan"
  | "missed-dose"
  | "consultation-request"
  | "complaint-intake"
  | "none"

export type MessageSource = {
  planId: string
  version: number
  doctorId: string
  confirmedAt: string
}

export type ChatMessage = {
  id: string
  role: "patient" | "companion"
  content: string
  createdAt: string
  scope: QuestionScope | null
  source: MessageSource | null
  isReported: boolean
}

export type ConversationCategory =
  | "medication"
  | "diet"
  | "activity"
  | "follow-up"
  | "plan-explanation"
  | "missed-dose"
  | "consultation-request"
  | "complaint"
  | "other"

export type ConversationEntry = {
  id: string
  content: string
  createdAt: string
  category: ConversationCategory
  scope: QuestionScope
}

export type ConversationSummary = {
  totalMessages: number
  escalatedCount: number
  categoryCounts: { category: ConversationCategory; count: number }[]
  entries: ConversationEntry[]
}

export type QuestionClassification = {
  scope: QuestionScope
  topic: CompanionTopic
  matchedItemIds: string[]
}
