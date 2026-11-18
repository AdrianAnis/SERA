import { DIET_RULE_LABEL } from "@/features/care-plan/labels"
import type { CarePlanItem } from "@/features/care-plan/types"
import { assertNever } from "@/lib/utils"
import { formatDate } from "@/lib/date"

export type ItemDetailRow = {
  label: string
  value: string
}

function describeFrequency(timesPerDay: number): string {
  return timesPerDay === 1 ? "Once daily" : `${timesPerDay} times daily`
}

export function getItemTitle(item: CarePlanItem): string {
  switch (item.kind) {
    case "medication":
      return `${item.drug} ${item.dose}`
    case "diet":
      return `${DIET_RULE_LABEL[item.rule]} ${item.category.toLowerCase()}`
    case "activity":
      return item.activity
    case "restriction":
      return `Limit ${item.subject.toLowerCase()}`
    case "followUp":
      return "Doctor follow-up"
    default:
      return assertNever(item)
  }
}

export function getItemSummary(item: CarePlanItem): string {
  switch (item.kind) {
    case "medication":
      return `${describeFrequency(item.times.length)}, at ${item.times.join(" and ")}`
    case "diet":
      return item.instruction
    case "activity":
      return `${item.durationMinutes} min, ${item.frequencyPerWeek}x a week`
    case "restriction":
      return item.instruction
    case "followUp":
      return formatDate(item.date, "EEEE, d MMMM yyyy")
    default:
      return assertNever(item)
  }
}

export function getItemDetailRows(item: CarePlanItem): ItemDetailRow[] {
  switch (item.kind) {
    case "medication":
      return [
        { label: "Dose", value: item.dose },
        { label: "Frequency", value: describeFrequency(item.times.length) },
        { label: "Times", value: item.times.join(", ") },
        { label: "Duration", value: `${item.durationDays} days` },
        { label: "Instructions", value: item.instruction },
      ]
    case "diet":
      return [
        { label: "Rule", value: DIET_RULE_LABEL[item.rule] },
        { label: "Category", value: item.category },
        { label: "Catatan", value: item.instruction },
      ]
    case "activity":
      return [
        { label: "Duration", value: `${item.durationMinutes} min` },
        { label: "Frequency", value: `${item.frequencyPerWeek}x a week` },
        { label: "Catatan", value: item.instruction },
      ]
    case "restriction":
      return [
        { label: "Restricted", value: item.subject },
        { label: "Duration", value: item.durationDays === null ? "Throughout treatment" : `${item.durationDays} days` },
        { label: "Catatan", value: item.instruction },
      ]
    case "followUp":
      return [
        { label: "Date", value: formatDate(item.date, "EEEE, d MMMM yyyy") },
        { label: "Catatan", value: item.instruction },
      ]
    default:
      return assertNever(item)
  }
}
