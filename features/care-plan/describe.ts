import { DIET_RULE_LABEL } from "@/features/care-plan/labels"
import type { CarePlanItem } from "@/features/care-plan/types"
import { assertNever } from "@/lib/utils"
import { formatDate } from "@/lib/date"

export type ItemDetailRow = {
  label: string
  value: string
}

function describeFrequency(timesPerDay: number): string {
  return timesPerDay === 1 ? "Sekali sehari" : `${timesPerDay} kali sehari`
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
      return `Batasi ${item.subject.toLowerCase()}`
    case "followUp":
      return "Kontrol ke dokter"
    default:
      return assertNever(item)
  }
}

export function getItemSummary(item: CarePlanItem): string {
  switch (item.kind) {
    case "medication":
      return `${describeFrequency(item.times.length)}, jam ${item.times.join(" dan ")}`
    case "diet":
      return item.instruction
    case "activity":
      return `${item.durationMinutes} menit, ${item.frequencyPerWeek}x seminggu`
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
        { label: "Dosis", value: item.dose },
        { label: "Frekuensi", value: describeFrequency(item.times.length) },
        { label: "Jam minum", value: item.times.join(", ") },
        { label: "Lama minum", value: `${item.durationDays} hari` },
        { label: "Cara minum", value: item.instruction },
      ]
    case "diet":
      return [
        { label: "Aturan", value: DIET_RULE_LABEL[item.rule] },
        { label: "Kategori", value: item.category },
        { label: "Catatan", value: item.instruction },
      ]
    case "activity":
      return [
        { label: "Durasi", value: `${item.durationMinutes} menit` },
        { label: "Frekuensi", value: `${item.frequencyPerWeek}x seminggu` },
        { label: "Catatan", value: item.instruction },
      ]
    case "restriction":
      return [
        { label: "Yang dibatasi", value: item.subject },
        { label: "Lama", value: item.durationDays === null ? "Selama masa pengobatan" : `${item.durationDays} hari` },
        { label: "Catatan", value: item.instruction },
      ]
    case "followUp":
      return [
        { label: "Tanggal", value: formatDate(item.date, "EEEE, d MMMM yyyy") },
        { label: "Catatan", value: item.instruction },
      ]
    default:
      return assertNever(item)
  }
}
