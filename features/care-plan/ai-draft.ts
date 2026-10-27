import { createItemId } from "@/features/care-plan/factory"
import type { CarePlanItem } from "@/features/care-plan/types"
import { daysFromToday, toDateKey } from "@/lib/date"
import { mockAiDraftTemplates } from "@/mocks/ai-drafts"

const DAY_PART_TIMES: [string, string][] = [
  ["pagi", "07:00"],
  ["siang", "13:00"],
  ["sore", "17:00"],
  ["malam", "19:00"],
]

const TIMES_BY_DAILY_COUNT: Record<number, string[]> = {
  1: ["07:00"],
  2: ["07:00", "19:00"],
  3: ["07:00", "13:00", "19:00"],
}

const DEFAULT_MEDICATION_DAYS = 30

const DIET_VERBS: [string, "avoid" | "limit" | "recommend"][] = [
  ["hindari", "avoid"],
  ["jangan makan", "avoid"],
  ["batasi", "limit"],
  ["kurangi", "limit"],
  ["perbanyak", "recommend"],
  ["anjurkan", "recommend"],
]

const ACTIVITY_NAMES = ["jalan kaki", "senam", "olahraga", "berenang", "bersepeda", "yoga"]

const FOLLOW_UP_UNIT_DAYS: Record<string, number> = { hari: 1, minggu: 7, bulan: 30 }

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function parseMedicationTimes(sentence: string): string[] {
  const dailyCount = Number(/(\d)\s*x\s*sehari/.exec(sentence)?.[1])
  const countedTimes = TIMES_BY_DAILY_COUNT[dailyCount]
  if (countedTimes) return countedTimes
  const dayPartTimes = DAY_PART_TIMES.filter(([dayPart]) => sentence.includes(dayPart)).map(([, time]) => time)
  return dayPartTimes.length > 0 ? dayPartTimes : TIMES_BY_DAILY_COUNT[1] ?? []
}

function parseMedication(sentence: string): CarePlanItem | null {
  const match = /\b([a-z]{4,})\s+(\d+(?:[.,]\d+)?)\s*(mg|mcg|ml|g)\b/.exec(sentence)
  if (!match) return null
  const [, drug = "", amount = "", unit = ""] = match
  const durationDays = Number(/(\d+)\s*hari/.exec(sentence)?.[1] ?? DEFAULT_MEDICATION_DAYS)
  return {
    id: createItemId("medication"),
    kind: "medication",
    drug: capitalize(drug),
    dose: `${amount} ${unit}`,
    times: parseMedicationTimes(sentence),
    durationDays,
    instruction: "",
    aiSuggested: true,
  }
}

function parseDiet(sentence: string): CarePlanItem | null {
  const verb = DIET_VERBS.find(([keyword]) => sentence.startsWith(keyword))
  if (!verb) return null
  const subject = sentence.slice(verb[0].length).trim()
  if (!subject) return null
  return { id: createItemId("diet"), kind: "diet", category: capitalize(subject), rule: verb[1], instruction: "", aiSuggested: true }
}

function parseActivity(sentence: string): CarePlanItem | null {
  const activity = ACTIVITY_NAMES.find((name) => sentence.includes(name))
  if (!activity) return null
  return {
    id: createItemId("activity"),
    kind: "activity",
    activity: capitalize(activity),
    frequencyPerWeek: Number(/(\d)\s*x\s*(?:seminggu|sepekan)/.exec(sentence)?.[1] ?? 3),
    durationMinutes: Number(/(\d+)\s*menit/.exec(sentence)?.[1] ?? 30),
    instruction: "",
    aiSuggested: true,
  }
}

function parseFollowUp(sentence: string): CarePlanItem | null {
  const match = /kontrol\s+(\d+)\s*(hari|minggu|bulan)\s+lagi/.exec(sentence)
  if (!match) return null
  const unitDays = FOLLOW_UP_UNIT_DAYS[match[2] ?? "hari"] ?? 1
  return {
    id: createItemId("followUp"),
    kind: "followUp",
    date: toDateKey(daysFromToday(Number(match[1]) * unitDays)),
    instruction: "Kontrol ke dokter.",
    aiSuggested: true,
  }
}

function parseRestriction(sentence: string): CarePlanItem | null {
  const match = /^(?:tidak boleh|jangan)\s+(.+)$/.exec(sentence)
  if (!match?.[1]) return null
  return { id: createItemId("restriction"), kind: "restriction", subject: capitalize(match[1]), durationDays: null, instruction: "", aiSuggested: true }
}

function parseSentence(sentence: string): CarePlanItem | null {
  return parseFollowUp(sentence) ?? parseRestriction(sentence) ?? parseDiet(sentence) ?? parseMedication(sentence) ?? parseActivity(sentence)
}

function parseInstructions(text: string): CarePlanItem[] {
  return text
    .toLowerCase()
    .split(/[.\n]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
    .map(parseSentence)
    .filter((item): item is CarePlanItem => item !== null)
}

export function generateDraftItems(text: string): CarePlanItem[] {
  const normalized = text.toLowerCase()
  const template = mockAiDraftTemplates.find((candidate) => candidate.keywords.every((keyword) => normalized.includes(keyword)))
  const items = template ? template.items : parseInstructions(text)
  return items.map((item) => ({ ...item, id: createItemId(item.kind), aiSuggested: true }))
}
