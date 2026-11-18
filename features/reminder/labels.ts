import type { ReminderKind } from "@/features/reminder/selectors"

export const REMINDER_KIND_LABEL: Record<ReminderKind, string> = {
  medication: "Medication",
  activity: "Activity",
}
