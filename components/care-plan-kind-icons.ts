import { CalendarCheck, Footprints, Pill, Salad, ShieldAlert, type LucideIcon } from "lucide-react"

import type { CarePlanItemKind } from "@/features/care-plan/types"

export const CARE_PLAN_KIND_ICON: Record<CarePlanItemKind, LucideIcon> = {
  medication: Pill,
  diet: Salad,
  activity: Footprints,
  restriction: ShieldAlert,
  followUp: CalendarCheck,
}
