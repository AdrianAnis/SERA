export type CarePlanStatus = "active" | "superseded"

export type MedicationItem = { id: string; kind: "medication"; drug: string; dose: string; times: string[]; durationDays: number; instruction: string; aiSuggested: boolean }
export type DietItem = { id: string; kind: "diet"; category: string; rule: "avoid" | "limit" | "recommend"; instruction: string; aiSuggested: boolean }
export type ActivityItem = { id: string; kind: "activity"; activity: string; frequencyPerWeek: number; durationMinutes: number; instruction: string; aiSuggested: boolean }
type RestrictionItem = { id: string; kind: "restriction"; subject: string; durationDays: number | null; instruction: string; aiSuggested: boolean }
export type FollowUpItem = { id: string; kind: "followUp"; date: string; instruction: string; aiSuggested: boolean }

export type CarePlanItem = MedicationItem | DietItem | ActivityItem | RestrictionItem | FollowUpItem

export type CarePlanItemKind = CarePlanItem["kind"]

export type CarePlanItemOf<K extends CarePlanItemKind> = Extract<CarePlanItem, { kind: K }>

export type CarePlan = {
  id: string
  patientId: string
  version: number
  status: CarePlanStatus
  sourceText: string
  createdBy: string
  createdAt: string
  confirmedAt: string | null
  items: CarePlanItem[]
}

export type CarePlanInput = Pick<CarePlan, "patientId" | "createdBy" | "sourceText" | "items">
