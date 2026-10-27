import { selectItemsByKind, selectNextFollowUp } from "@/features/care-plan/selectors"
import { DIET_RULE_LABEL } from "@/features/care-plan/labels"
import type { CarePlan } from "@/features/care-plan/types"
import { classifyQuestion } from "@/features/companion/scope"
import type { CompanionTopic, MessageSource, QuestionScope } from "@/features/companion/types"
import { getTodayReminders } from "@/features/reminder/selectors"
import { formatDate, toDateKey } from "@/lib/date"
import { assertNever } from "@/lib/utils"

export type CompanionAnswer = {
  scope: QuestionScope
  content: string
  source: MessageSource | null
}

export const EMERGENCY_NUMBER = "119"

export type QuickActionKey = "consultation" | "complaint" | "medication" | "diet" | "follow-up"

export type QuickAction = {
  key: QuickActionKey
  label: string
  message: string
}

export const QUICK_ACTIONS: QuickAction[] = [
  { key: "consultation", label: "Ajukan jadwal", message: "Saya ingin mengajukan jadwal konsultasi." },
  { key: "complaint", label: "Sampaikan keluhan", message: "Saya ingin menyampaikan keluhan." },
  { key: "medication", label: "Jadwal obat", message: "Sekarang harus minum obat apa?" },
  { key: "diet", label: "Pantangan makanan", message: "Boleh makan ikan asin?" },
  { key: "follow-up", label: "Jadwal kontrol", message: "Kapan jadwal kontrol berikutnya?" },
]

export type SuggestionCard = {
  title: string
  description: string
  question: string
}

export const SUGGESTION_CARDS: SuggestionCard[] = [
  { title: "Jadwal obat", description: "Obat apa yang perlu diminum hari ini", question: "Sekarang harus minum obat apa?" },
  { title: "Pantangan makanan", description: "Cek makanan yang boleh dan tidak", question: "Boleh makan ikan asin?" },
  { title: "Jelaskan instruksi", description: "Penjelasan sederhana dari dokter", question: "Jelaskan instruksi dokter ini" },
  { title: "Dosis obat", description: "Dosis dan jam minum obat kamu", question: "Berapa dosis obat saya?" },
]

const URGENT_MESSAGE =
  "Keluhan ini bisa jadi tanda kondisi yang perlu ditangani segera. Aku tidak bisa menyarankan obat apa pun. Segera hubungi rumah sakit atau datang ke IGD terdekat."

export const OUT_OF_SCOPE_MESSAGE =
  "Pertanyaan ini di luar care plan dari dokter kamu, jadi aku tidak bisa menjawabnya. Silakan tanyakan langsung ke dokter. Aku bisa bantu soal obat, makanan, aktivitas, dan jadwal kontrol di care plan."

const MISSED_DOSE_MESSAGE =
  "Aturan untuk dosis yang terlewat berbeda tiap obat, dan aku tidak boleh mengarang aturan dosis. Tanyakan ke dokter atau apoteker kamu ya."

const CONSULTATION_REQUEST_MESSAGE =
  "Baik, aku bantu ajukan jadwal konsultasi ke dokter kamu. Kamu lebih nyaman di hari dan jam berapa? Contoh: Kamis pagi."

const COMPLAINT_INTAKE_MESSAGE =
  "Aku siap mendengarkan. Ceritakan apa yang kamu rasakan, sejak kapan, dan seberapa sering. Pesan kamu akan diteruskan ke dokter. Kalau ada nyeri dada atau sesak napas, segera ke IGD."

const NO_PLAN_MESSAGE = "Belum ada care plan aktif dari dokter kamu, jadi belum ada instruksi yang bisa aku jelaskan."

const NO_DIET_RULE_MESSAGE =
  "Di care plan kamu tidak ada aturan khusus tentang makanan atau minuman itu. Supaya aman, tanyakan langsung ke dokter."

function buildSource(plan: CarePlan): MessageSource | null {
  if (!plan.confirmedAt) return null
  return { planId: plan.id, version: plan.version, doctorId: plan.createdBy, confirmedAt: plan.confirmedAt }
}

function describeMedicationToday(plan: CarePlan, now: Date): string {
  const medications = getTodayReminders(plan, now).filter((reminder) => reminder.kind === "medication")
  if (medications.length === 0) return "Tidak ada jadwal obat untuk hari ini di care plan kamu."
  const lines = medications.map((reminder) => `• ${reminder.time} — ${reminder.title}. ${reminder.detail}`)
  return ["Jadwal obat kamu hari ini:", ...lines].join("\n")
}

function describeMedicationDetail(plan: CarePlan, matchedItemIds: string[]): string {
  const medications = selectItemsByKind(plan, "medication")
  const selected = medications.filter((item) => matchedItemIds.includes(item.id))
  const items = selected.length > 0 ? selected : medications
  if (items.length === 0) return "Care plan kamu tidak berisi obat."
  const lines = items.map(
    (item) =>
      `• ${item.drug} ${item.dose}, jam ${item.times.join(" dan ")}, selama ${item.durationDays} hari. ${item.instruction}`,
  )
  return lines.join("\n")
}

function describeDiet(plan: CarePlan, matchedItemIds: string[]): string {
  const matched = selectItemsByKind(plan, "diet").filter((item) => matchedItemIds.includes(item.id))
  if (matched.length === 0) return NO_DIET_RULE_MESSAGE
  return matched.map((item) => `• ${DIET_RULE_LABEL[item.rule]}: ${item.category}. ${item.instruction}`).join("\n")
}

function describeActivity(plan: CarePlan): string {
  const activities = selectItemsByKind(plan, "activity")
  const restrictions = selectItemsByKind(plan, "restriction")
  if (activities.length === 0 && restrictions.length === 0) return "Care plan kamu belum berisi aktivitas atau pembatasan."
  const activityLines = activities.map(
    (item) => `• ${item.activity}, ${item.durationMinutes} menit, ${item.frequencyPerWeek}x seminggu. ${item.instruction}`,
  )
  const restrictionLines = restrictions.map((item) => `• Batasi: ${item.subject}. ${item.instruction}`)
  return [...activityLines, ...restrictionLines].join("\n")
}

function describeFollowUp(plan: CarePlan, now: Date): string {
  const next = selectNextFollowUp(plan, toDateKey(now))
  if (!next) return "Belum ada jadwal kontrol berikutnya di care plan kamu."
  return `Kontrol berikutnya: ${formatDate(next.date, "EEEE, d MMMM yyyy")}. ${next.instruction}`
}

function describePlanInPlainWords(plan: CarePlan): string {
  const medications = selectItemsByKind(plan, "medication").map((item) => `${item.drug} ${item.dose}`)
  const diets = selectItemsByKind(plan, "diet").map((item) => `${DIET_RULE_LABEL[item.rule].toLowerCase()} ${item.category.toLowerCase()}`)
  const activities = selectItemsByKind(plan, "activity").map((item) => item.activity.toLowerCase())
  const parts = [
    medications.length > 0 ? `minum ${medications.join(", ")}` : null,
    diets.length > 0 ? diets.join(", ") : null,
    activities.length > 0 ? `lakukan ${activities.join(", ")}` : null,
  ].filter((part): part is string => part !== null)
  return `Singkatnya, dokter meminta kamu untuk ${parts.join("; ")}.\n\nCatatan asli dokter: "${plan.sourceText}"`
}

function describeInScope(topic: CompanionTopic, plan: CarePlan, matchedItemIds: string[], now: Date): string {
  switch (topic) {
    case "medication-today":
      return describeMedicationToday(plan, now)
    case "medication-detail":
      return describeMedicationDetail(plan, matchedItemIds)
    case "diet":
      return describeDiet(plan, matchedItemIds)
    case "activity":
      return describeActivity(plan)
    case "follow-up":
      return describeFollowUp(plan, now)
    case "explain-plan":
      return describePlanInPlainWords(plan)
    case "missed-dose":
    case "consultation-request":
    case "complaint-intake":
    case "none":
      return OUT_OF_SCOPE_MESSAGE
    default:
      return assertNever(topic)
  }
}

export function answerQuestion(question: string, activePlan: CarePlan | undefined, now: Date): CompanionAnswer {
  const { scope, topic, matchedItemIds } = classifyQuestion(question, activePlan)

  if (scope === "urgent") return { scope, content: URGENT_MESSAGE, source: null }
  if (topic === "consultation-request") return { scope, content: CONSULTATION_REQUEST_MESSAGE, source: null }
  if (topic === "complaint-intake") return { scope, content: COMPLAINT_INTAKE_MESSAGE, source: null }
  if (!activePlan) return { scope: "out-of-scope", content: NO_PLAN_MESSAGE, source: null }
  if (topic === "missed-dose") return { scope, content: MISSED_DOSE_MESSAGE, source: null }
  if (scope === "out-of-scope") {
    return { scope, content: topic === "diet" ? NO_DIET_RULE_MESSAGE : OUT_OF_SCOPE_MESSAGE, source: null }
  }

  return { scope, content: describeInScope(topic, activePlan, matchedItemIds, now), source: buildSource(activePlan) }
}
