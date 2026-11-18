import type { ConversationCategory, QuestionScope } from "@/features/companion/types"

export const CONVERSATION_CATEGORY_LABEL: Record<ConversationCategory, string> = {
  medication: "Medication",
  diet: "Diet",
  activity: "Activity",
  "follow-up": "Follow-up schedule",
  "plan-explanation": "Care plan explanation",
  "missed-dose": "Missed dose",
  "consultation-request": "Appointment request",
  complaint: "Complaint",
  other: "Other",
}

export const QUESTION_SCOPE_LABEL: Record<QuestionScope, string> = {
  "in-scope": "Answered by Companion",
  "out-of-scope": "Forwarded to doctor",
  urgent: "Urgent",
}
