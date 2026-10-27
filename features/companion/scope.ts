import { selectItemsByKind } from "@/features/care-plan/selectors"
import type { CarePlan, DietItem, MedicationItem } from "@/features/care-plan/types"
import type { CompanionTopic, QuestionClassification } from "@/features/companion/types"

const URGENT_KEYWORDS = [
  "nyeri dada",
  "dada sakit",
  "dada saya nyeri",
  "sesak",
  "sulit bernapas",
  "pingsan",
  "tidak sadar",
  "kejang",
  "pendarahan",
  "perdarahan",
  "muntah darah",
  "bab hitam",
  "lumpuh",
  "mati rasa",
  "bicara pelo",
  "wajah mencong",
  "stroke",
  "bunuh diri",
  "overdosis",
  "demam tinggi",
]

const SYMPTOM_KEYWORDS = ["pusing", "mual", "nyeri", "sakit", "lemas", "bengkak", "gatal", "muntah", "pegal", "berdebar", "mengantuk", "perih", "demam"]

const MISSED_DOSE_KEYWORDS = ["lupa minum", "lupa obat", "terlewat", "kelewatan", "telat minum", "ketinggalan minum"]

const CONSULTATION_REQUEST_KEYWORDS = ["ajukan jadwal", "mengajukan jadwal", "jadwal konsultasi", "buat janji", "janji temu"]

const COMPLAINT_INTENT_KEYWORDS = ["menyampaikan keluhan", "ada keluhan", "ingin lapor", "mau lapor"]

const EXPLAIN_KEYWORDS = ["jelaskan", "penjelasan", "maksud instruksi", "arti instruksi", "instruksi dokter"]

const MEDICATION_TODAY_KEYWORDS = ["minum obat apa", "obat apa", "obat hari ini", "jadwal obat", "obat sekarang", "obat malam", "obat pagi"]

const MEDICATION_DETAIL_KEYWORDS = ["dosis", "berapa mg", "berapa kali", "obat saya"]

const ACTIVITY_KEYWORDS = ["olahraga", "jalan kaki", "senam", "aktivitas", "lari", "berenang", "angkat beban", "bersepeda"]

const FOLLOW_UP_KEYWORDS = ["kontrol", "jadwal dokter", "kunjungan", "kapan balik", "follow up"]

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim()
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword))
}

function selectMentionedMedications(text: string, plan: CarePlan): MedicationItem[] {
  return selectItemsByKind(plan, "medication").filter((item) => text.includes(item.drug.toLowerCase()))
}

function buildDietKeywords(item: DietItem): string[] {
  return [item.category, ...item.instruction.split(/[,.;]| dan /)]
    .map((keyword) => normalize(keyword))
    .filter((keyword) => keyword.length >= 4)
}

function selectMentionedDiets(text: string, plan: CarePlan): DietItem[] {
  return selectItemsByKind(plan, "diet").filter((item) => includesAny(text, buildDietKeywords(item)))
}

function isFoodQuestion(text: string): boolean {
  return includesAny(text, ["makan", "minum kopi", "minuman", "boleh", "pantangan", "diet"])
}

function classifyWithPlan(text: string, plan: CarePlan): QuestionClassification {
  const medications = selectMentionedMedications(text, plan)
  if (medications.length > 0) {
    return { scope: "in-scope", topic: "medication-detail", matchedItemIds: medications.map((item) => item.id) }
  }

  const diets = selectMentionedDiets(text, plan)
  if (diets.length > 0) {
    return { scope: "in-scope", topic: "diet", matchedItemIds: diets.map((item) => item.id) }
  }

  const topicByKeywords: [string[], CompanionTopic][] = [
    [EXPLAIN_KEYWORDS, "explain-plan"],
    [MEDICATION_TODAY_KEYWORDS, "medication-today"],
    [MEDICATION_DETAIL_KEYWORDS, "medication-detail"],
    [ACTIVITY_KEYWORDS, "activity"],
    [FOLLOW_UP_KEYWORDS, "follow-up"],
  ]
  const matched = topicByKeywords.find(([keywords]) => includesAny(text, keywords))
  if (matched) return { scope: "in-scope", topic: matched[1], matchedItemIds: [] }

  return { scope: "out-of-scope", topic: isFoodQuestion(text) ? "diet" : "none", matchedItemIds: [] }
}

export function classifyQuestion(question: string, activePlan: CarePlan | undefined): QuestionClassification {
  const text = normalize(question)

  if (includesAny(text, URGENT_KEYWORDS)) return { scope: "urgent", topic: "none", matchedItemIds: [] }
  if (includesAny(text, CONSULTATION_REQUEST_KEYWORDS)) return { scope: "in-scope", topic: "consultation-request", matchedItemIds: [] }
  if (includesAny(text, COMPLAINT_INTENT_KEYWORDS)) return { scope: "in-scope", topic: "complaint-intake", matchedItemIds: [] }
  if (includesAny(text, MISSED_DOSE_KEYWORDS)) return { scope: "out-of-scope", topic: "missed-dose", matchedItemIds: [] }
  if (!activePlan) return { scope: "out-of-scope", topic: "none", matchedItemIds: [] }

  return classifyWithPlan(text, activePlan)
}

export function isSymptomComplaint(question: string): boolean {
  return includesAny(normalize(question), SYMPTOM_KEYWORDS)
}
