import { addDays, differenceInCalendarDays, format, getDay, parseISO, startOfDay } from "date-fns"
import { id } from "date-fns/locale"

export type DateInput = Date | string

export function toDate(value: DateInput): Date {
  return typeof value === "string" ? parseISO(value) : value
}

export function toDateKey(value: DateInput): string {
  return format(toDate(value), "yyyy-MM-dd")
}

export function toTimeKey(value: DateInput): string {
  return format(toDate(value), "HH:mm")
}

export function getWeekday(value: DateInput): number {
  return getDay(toDate(value))
}

export function daysFromToday(days: number, time = "08:00"): string {
  const [hours = 0, minutes = 0] = time.split(":").map(Number)
  const date = addDays(startOfDay(new Date()), days)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

export function getRecentDays(count: number, today: Date): Date[] {
  return Array.from({ length: count }, (_, index) => addDays(startOfDay(today), index - (count - 1)))
}

export function combineDateAndTime(dateKey: string, time: string | null): string {
  return parseISO(`${dateKey}T${time ?? "12:00"}:00`).toISOString()
}

export function daysBetween(from: DateInput, to: DateInput): number {
  return differenceInCalendarDays(toDate(to), toDate(from))
}

export function formatDate(value: DateInput, pattern = "d MMM yyyy"): string {
  return format(toDate(value), pattern, { locale: id })
}

export function formatDateTime(value: DateInput): string {
  return format(toDate(value), "d MMM yyyy, HH:mm", { locale: id })
}

export function getGreeting(value: DateInput): string {
  const hour = toDate(value).getHours()
  if (hour < 11) return "Selamat pagi"
  if (hour < 15) return "Selamat siang"
  if (hour < 18) return "Selamat sore"
  return "Selamat malam"
}
