import type { FeedbackCategory, FeedbackStatus } from "@/features/feedback/types"

export const FEEDBACK_CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  "side-effect": "Side effect",
  symptom: "Symptom",
  obstacle: "Adherence obstacle",
  other: "Other",
}

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  open: "Not reviewed",
  resolved: "Reviewed",
}
