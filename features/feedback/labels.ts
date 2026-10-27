import type { FeedbackCategory, FeedbackStatus } from "@/features/feedback/types"

export const FEEDBACK_CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  "side-effect": "Efek samping",
  symptom: "Gejala",
  obstacle: "Kendala menjalankan",
  other: "Lainnya",
}

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  open: "Belum ditinjau",
  resolved: "Sudah ditinjau",
}
