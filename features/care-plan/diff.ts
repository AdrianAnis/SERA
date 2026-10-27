import { getItemDetailRows, getItemTitle } from "@/features/care-plan/describe"
import type { CarePlanItem } from "@/features/care-plan/types"
import { assertNever } from "@/lib/utils"

export type PlanChangeType = "added" | "removed" | "changed"

export type PlanChange = {
  type: PlanChangeType
  title: string
  details: string[]
}

function getItemIdentity(item: CarePlanItem): string {
  switch (item.kind) {
    case "medication":
      return `medication:${item.drug.toLowerCase()}`
    case "diet":
      return `diet:${item.category.toLowerCase()}`
    case "activity":
      return `activity:${item.activity.toLowerCase()}`
    case "restriction":
      return `restriction:${item.subject.toLowerCase()}`
    case "followUp":
      return "followUp"
    default:
      return assertNever(item)
  }
}

function describeFieldChanges(before: CarePlanItem, after: CarePlanItem): string[] {
  const beforeRows = getItemDetailRows(before)
  return getItemDetailRows(after).flatMap((row) => {
    const previous = beforeRows.find((candidate) => candidate.label === row.label)
    return previous && previous.value !== row.value ? [`${row.label}: ${previous.value} → ${row.value}`] : []
  })
}

export function diffCarePlanItems(before: CarePlanItem[], after: CarePlanItem[]): PlanChange[] {
  const beforeByIdentity = new Map(before.map((item) => [getItemIdentity(item), item]))
  const afterIdentities = new Set(after.map(getItemIdentity))

  const addedAndChanged = after.flatMap<PlanChange>((item) => {
    const previous = beforeByIdentity.get(getItemIdentity(item))
    if (!previous) return [{ type: "added", title: getItemTitle(item), details: [] }]
    const details = describeFieldChanges(previous, item)
    return details.length > 0 ? [{ type: "changed", title: getItemTitle(item), details }] : []
  })

  const removed = before
    .filter((item) => !afterIdentities.has(getItemIdentity(item)))
    .map<PlanChange>((item) => ({ type: "removed", title: getItemTitle(item), details: [] }))

  return [...addedAndChanged, ...removed]
}
