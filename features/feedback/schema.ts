import { z } from "zod"

import { FEEDBACK_CATEGORIES } from "@/features/feedback/types"

export const feedbackFormSchema = z.object({
  category: z.enum(FEEDBACK_CATEGORIES, { message: "Pilih jenis laporan" }),
  message: z.string().trim().min(10, "Ceritakan minimal 10 karakter"),
})

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>
