import type { FeedbackEntry } from "@/features/feedback/types"

export function selectPatientFeedback(entries: FeedbackEntry[], patientId: string): FeedbackEntry[] {
  return entries
    .filter((entry) => entry.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function selectOpenFeedback(entries: FeedbackEntry[]): FeedbackEntry[] {
  return entries.filter((entry) => entry.status === "open")
}
