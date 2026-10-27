export type ReminderCompletion = {
  key: string
  completedAt: string
}

export const FEEDBACK_CATEGORIES = ["side-effect", "symptom", "obstacle", "other"] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export type FeedbackStatus = "open" | "resolved"

export type FeedbackEntry = {
  id: string
  patientId: string
  category: FeedbackCategory
  message: string
  status: FeedbackStatus
  createdAt: string
}
