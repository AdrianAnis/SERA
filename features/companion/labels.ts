import type { ConversationCategory, QuestionScope } from "@/features/companion/types"

export const CONVERSATION_CATEGORY_LABEL: Record<ConversationCategory, string> = {
  medication: "Obat",
  diet: "Makanan",
  activity: "Aktivitas",
  "follow-up": "Jadwal kontrol",
  "plan-explanation": "Penjelasan care plan",
  "missed-dose": "Lupa minum obat",
  "consultation-request": "Pengajuan jadwal",
  complaint: "Keluhan",
  other: "Lainnya",
}

export const QUESTION_SCOPE_LABEL: Record<QuestionScope, string> = {
  "in-scope": "Dijawab Companion",
  "out-of-scope": "Diteruskan ke dokter",
  urgent: "Darurat",
}
