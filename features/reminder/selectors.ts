import { selectItemsByKind } from "@/features/care-plan/selectors"
import type { ActivityItem, CarePlan, MedicationItem } from "@/features/care-plan/types"
import type { ReminderCompletion } from "@/features/feedback/types"
import { daysBetween, getRecentDays, getWeekday, toDate, toDateKey, toTimeKey, type DateInput } from "@/lib/date"

export type ReminderKind = "medication" | "activity"

export type ReminderStatus = "done" | "overdue" | "upcoming" | "anytime"

export type Reminder = {
  key: string
  itemId: string
  kind: ReminderKind
  date: string
  time: string | null
  title: string
  detail: string
}

export type ReminderView = Reminder & {
  status: ReminderStatus
  completedAt: string | null
}

export type AdherenceDay = {
  date: string
  done: number
  total: number
}

export type AdherenceTrendPoint = {
  date: string
  medication: number | null
  activity: number | null
}

export type AdherenceTrendSummary = {
  medicationAverage: number | null
  activityAverage: number | null
  lowest: { kind: ReminderKind; date: string; percent: number } | undefined
}

const ANYTIME_SLOT = "anytime"

const WEEKDAYS_BY_FREQUENCY: Record<number, number[]> = {
  1: [3],
  2: [2, 5],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
}

const ADHERENCE_WINDOW_DAYS = 7

function reminderKey(itemId: string, date: string, slot: string): string {
  return `${itemId}:${date}:${slot}`
}

function isMedicationDue(item: MedicationItem, plan: CarePlan, day: Date): boolean {
  if (!plan.confirmedAt) return false
  const elapsedDays = daysBetween(plan.confirmedAt, day)
  return elapsedDays >= 0 && elapsedDays < item.durationDays
}

function isActivityDue(item: ActivityItem, plan: CarePlan, day: Date): boolean {
  if (!plan.confirmedAt || daysBetween(plan.confirmedAt, day) < 0) return false
  const weekdays = WEEKDAYS_BY_FREQUENCY[item.frequencyPerWeek]
  return weekdays ? weekdays.includes(getWeekday(day)) : true
}

function compareReminders(a: Reminder, b: Reminder): number {
  if (a.time === b.time) return a.title.localeCompare(b.title)
  if (a.time === null) return 1
  if (b.time === null) return -1
  return a.time.localeCompare(b.time)
}

function buildReminders(plan: CarePlan, day: Date): Reminder[] {
  const dateKey = toDateKey(day)

  const medication = selectItemsByKind(plan, "medication")
    .filter((item) => isMedicationDue(item, plan, day))
    .flatMap((item) =>
      item.times.map<Reminder>((time) => ({
        key: reminderKey(item.id, dateKey, time),
        itemId: item.id,
        kind: "medication",
        date: dateKey,
        time,
        title: `${item.drug} ${item.dose}`,
        detail: item.instruction,
      })),
    )

  const activity = selectItemsByKind(plan, "activity")
    .filter((item) => isActivityDue(item, plan, day))
    .map<Reminder>((item) => ({
      key: reminderKey(item.id, dateKey, ANYTIME_SLOT),
      itemId: item.id,
      kind: "activity",
      date: dateKey,
      time: null,
      title: item.activity,
      detail: `${item.durationMinutes} menit`,
    }))

  return [...medication, ...activity].sort(compareReminders)
}

export function getTodayReminders(activePlan: CarePlan | undefined, date: DateInput): Reminder[] {
  if (activePlan?.status !== "active") return []
  return buildReminders(activePlan, toDate(date))
}

function selectPlanInEffect(patientPlans: CarePlan[], day: Date): CarePlan | undefined {
  const dayKey = toDateKey(day)
  return patientPlans
    .filter((plan) => plan.confirmedAt !== null && toDateKey(plan.confirmedAt) <= dayKey)
    .sort((a, b) => b.version - a.version)[0]
}

function resolveStatus(reminder: Reminder, completion: ReminderCompletion | undefined, now: Date): ReminderStatus {
  if (completion) return "done"
  if (reminder.time === null) return "anytime"
  return reminder.time < toTimeKey(now) ? "overdue" : "upcoming"
}

export function selectReminderViews(
  reminders: Reminder[],
  completions: Record<string, ReminderCompletion>,
  now: Date,
): ReminderView[] {
  return reminders.map((reminder) => {
    const completion = completions[reminder.key]
    return {
      ...reminder,
      status: resolveStatus(reminder, completion, now),
      completedAt: completion?.completedAt ?? null,
    }
  })
}

export function selectNextReminder(views: ReminderView[]): ReminderView | undefined {
  const pending = views.filter((view) => view.status === "overdue" || view.status === "upcoming")
  return pending.find((view) => view.status === "overdue") ?? pending[0]
}

export function selectDailyProgress(views: ReminderView[]): { done: number; total: number } {
  return { done: views.filter((view) => view.status === "done").length, total: views.length }
}

export function selectAdherenceByDay(
  patientPlans: CarePlan[],
  completions: Record<string, ReminderCompletion>,
  today: Date,
): AdherenceDay[] {
  return getRecentDays(ADHERENCE_WINDOW_DAYS, today).map((day) => {
    const planInEffect = selectPlanInEffect(patientPlans, day)
    const reminders = planInEffect ? buildReminders(planInEffect, day) : []
    return {
      date: toDateKey(day),
      total: reminders.length,
      done: reminders.filter((reminder) => completions[reminder.key]).length,
    }
  })
}

export function selectAdherenceRatio(days: AdherenceDay[]): number | null {
  const total = days.reduce((sum, day) => sum + day.total, 0)
  if (total === 0) return null
  return days.reduce((sum, day) => sum + day.done, 0) / total
}

function percentDone(reminders: Reminder[], completions: Record<string, ReminderCompletion>): number | null {
  if (reminders.length === 0) return null
  return Math.round((reminders.filter((reminder) => completions[reminder.key]).length / reminders.length) * 100)
}

export function selectAdherenceTrend(
  patientPlans: CarePlan[],
  completions: Record<string, ReminderCompletion>,
  today: Date,
): AdherenceTrendPoint[] {
  return getRecentDays(ADHERENCE_WINDOW_DAYS + 1, today).slice(0, ADHERENCE_WINDOW_DAYS).map((day) => {
    const planInEffect = selectPlanInEffect(patientPlans, day)
    const reminders = planInEffect ? buildReminders(planInEffect, day) : []
    return {
      date: toDateKey(day),
      medication: percentDone(reminders.filter((reminder) => reminder.kind === "medication"), completions),
      activity: percentDone(reminders.filter((reminder) => reminder.kind === "activity"), completions),
    }
  })
}

function averagePercent(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => value !== null)
  if (present.length === 0) return null
  return Math.round(present.reduce((sum, value) => sum + value, 0) / present.length)
}

export function selectAdherenceTrendSummary(points: AdherenceTrendPoint[]): AdherenceTrendSummary {
  const candidates = points.flatMap((point) => [
    ...(point.medication === null ? [] : [{ kind: "medication" as const, date: point.date, percent: point.medication }]),
    ...(point.activity === null ? [] : [{ kind: "activity" as const, date: point.date, percent: point.activity }]),
  ])
  return {
    medicationAverage: averagePercent(points.map((point) => point.medication)),
    activityAverage: averagePercent(points.map((point) => point.activity)),
    lowest: candidates.sort((a, b) => a.percent - b.percent)[0],
  }
}
