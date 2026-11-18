import type { ConsultationStatus, Weekday } from "@/features/consultation/types"

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

export const WEEKDAY_SHORT_LABEL: Record<Weekday, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
}

export const WEEKDAY_DISPLAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]
