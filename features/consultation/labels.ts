import type { ConsultationStatus, Weekday } from "@/features/consultation/types"

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  scheduled: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
}

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
}

export const WEEKDAY_SHORT_LABEL: Record<Weekday, string> = {
  0: "Min",
  1: "Sen",
  2: "Sel",
  3: "Rab",
  4: "Kam",
  5: "Jum",
  6: "Sab",
}

export const WEEKDAY_DISPLAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]
