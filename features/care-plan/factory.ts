import type { CarePlanItem, CarePlanItemKind, CarePlanItemOf } from "@/features/care-plan/types"
import { toDateKey, daysFromToday } from "@/lib/date"
import { assertNever } from "@/lib/utils"

const DEFAULT_FOLLOW_UP_DAYS = 14

export function createItemId(kind: CarePlanItemKind): string {
  return `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function createBlankItem<K extends CarePlanItemKind>(kind: K): CarePlanItemOf<K>
export function createBlankItem(kind: CarePlanItemKind): CarePlanItem {
  const base = { id: createItemId(kind), instruction: "", aiSuggested: false }
  switch (kind) {
    case "medication":
      return { ...base, kind, drug: "", dose: "", times: ["07:00"], durationDays: 30 }
    case "diet":
      return { ...base, kind, category: "", rule: "avoid" }
    case "activity":
      return { ...base, kind, activity: "", frequencyPerWeek: 3, durationMinutes: 30 }
    case "restriction":
      return { ...base, kind, subject: "", durationDays: null }
    case "followUp":
      return { ...base, kind, date: toDateKey(daysFromToday(DEFAULT_FOLLOW_UP_DAYS)) }
    default:
      return assertNever(kind)
  }
}
