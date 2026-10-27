import { selectEscalatedQuestions } from "@/features/companion/selectors"
import type { ChatMessage } from "@/features/companion/types"
import { selectOpenFeedback } from "@/features/feedback/selectors"
import type { FeedbackEntry } from "@/features/feedback/types"

export type AttentionKind = "feedback" | "escalation"

export type AttentionItem = {
  id: string
  kind: AttentionKind
  patientId: string
  detail: string
  occurredAt: string
}

type AttentionSources = {
  feedbackEntries: FeedbackEntry[]
  threads: Record<string, ChatMessage[]>
}

export const ATTENTION_KIND_LABEL: Record<AttentionKind, string> = {
  feedback: "Laporan pasien",
  escalation: "Pertanyaan dieskalasi",
}

export function selectAttentionItems({ feedbackEntries, threads }: AttentionSources): AttentionItem[] {
  const feedback = selectOpenFeedback(feedbackEntries).map<AttentionItem>((entry) => ({
    id: entry.id,
    kind: "feedback",
    patientId: entry.patientId,
    detail: entry.message,
    occurredAt: entry.createdAt,
  }))

  const escalations = Object.entries(threads).flatMap(([patientId, thread]) =>
    selectEscalatedQuestions(thread).map<AttentionItem>(({ question }) => ({
      id: question.id,
      kind: "escalation",
      patientId,
      detail: question.content,
      occurredAt: question.createdAt,
    })),
  )

  return [...feedback, ...escalations].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
}
