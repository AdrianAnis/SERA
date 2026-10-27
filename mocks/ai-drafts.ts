import type { CarePlanItem } from "@/features/care-plan/types"
import { daysFromToday, toDateKey } from "@/lib/date"

export type AiDraftTemplate = {
  keywords: string[]
  items: CarePlanItem[]
}

const demoDraftItems: CarePlanItem[] = [
      { id: "tpl-demo-m1", kind: "medication", drug: "Amlodipin", dose: "10 mg", times: ["07:00"], durationDays: 90, instruction: "Diminum setelah sarapan.", aiSuggested: true },
      { id: "tpl-demo-d1", kind: "diet", category: "Garam", rule: "limit", instruction: "Maksimal 1 sendok teh garam per hari, termasuk kecap dan saus.", aiSuggested: false },
      { id: "tpl-demo-d2", kind: "diet", category: "Makanan awetan", rule: "avoid", instruction: "Ikan asin, mi instan, kerupuk, sosis, dan kornet.", aiSuggested: false },
      { id: "tpl-demo-d3", kind: "diet", category: "Sayur dan buah", rule: "recommend", instruction: "Bayam, pisang, dan pepaya untuk asupan kalium.", aiSuggested: false },
      { id: "tpl-demo-a1", kind: "activity", activity: "Jalan kaki pagi", frequencyPerWeek: 5, durationMinutes: 30, instruction: "Hentikan bila pusing, berdebar, atau nyeri dada.", aiSuggested: false },
      { id: "tpl-demo-r1", kind: "restriction", subject: "Merokok", durationDays: null, instruction: "Berhenti merokok selama masa pengobatan.", aiSuggested: false },
      { id: "tpl-demo-f1", kind: "followUp", date: toDateKey(daysFromToday(14)), instruction: "Evaluasi tekanan darah setelah dosis dinaikkan.", aiSuggested: true },
]

export const mockAiDraftTemplates: AiDraftTemplate[] = [
  {
    keywords: ["amlodipin", "10 mg"],
    items: demoDraftItems,
  },
  {
    keywords: ["amlodipin", "5 mg", "jalan kaki"],
    items: [
      { id: "tpl-m1", kind: "medication", drug: "Amlodipin", dose: "5 mg", times: ["07:00"], durationDays: 30, instruction: "Diminum setiap pagi setelah sarapan.", aiSuggested: true },
      { id: "tpl-d1", kind: "diet", category: "Makanan tinggi garam", rule: "avoid", instruction: "Ikan asin, mi instan, kerupuk, dan makanan kemasan.", aiSuggested: true },
      { id: "tpl-a1", kind: "activity", activity: "Jalan kaki", frequencyPerWeek: 5, durationMinutes: 30, instruction: "Jalan santai, hentikan bila pusing atau nyeri dada.", aiSuggested: true },
      { id: "tpl-f1", kind: "followUp", date: toDateKey(daysFromToday(14)), instruction: "Kontrol tekanan darah dua minggu lagi.", aiSuggested: true },
    ],
  },
]
