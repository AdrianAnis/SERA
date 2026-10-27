import { selectActivePlan } from "@/features/care-plan/selectors"
import type { FeedbackEntry, ReminderCompletion } from "@/features/feedback/types"
import { getTodayReminders, type Reminder } from "@/features/reminder/selectors"
import { combineDateAndTime, daysFromToday, getRecentDays } from "@/lib/date"
import { mockCarePlans } from "@/mocks/care-plans"

const SEEDED_PAST_DAYS = 7

type DailyCompletionRatios = {
  medication: number[]
  activity: number[]
}

const COMPLETION_RATIOS_BY_PATIENT: Record<string, DailyCompletionRatios> = {
  "p-001": {
    medication: [1, 1, 1, 1, 0, 1, 1],
    activity: [1, 1, 0, 1, 1, 0, 1],
  },
  "p-002": {
    medication: [1, 1, 0.75, 0.75, 0.5, 0.5, 0.25],
    activity: [1, 1, 1, 0, 1, 0, 0],
  },
  "p-003": {
    medication: [1, 1, 0.66, 1, 1, 0.66, 1],
    activity: [1, 0, 1, 1, 0, 1, 1],
  },
}

function takeCompleted(reminders: Reminder[], ratio: number | undefined): Reminder[] {
  return reminders.slice(0, Math.ceil(reminders.length * (ratio ?? 0)))
}

function buildCompletions(): Record<string, ReminderCompletion> {
  const pastDays = getRecentDays(SEEDED_PAST_DAYS + 1, new Date()).slice(0, SEEDED_PAST_DAYS)

  return Object.entries(COMPLETION_RATIOS_BY_PATIENT)
    .flatMap(([patientId, ratios]) => {
      const plan = selectActivePlan(mockCarePlans, patientId)
      return pastDays.flatMap((day, index) => {
        const reminders = getTodayReminders(plan, day)
        const completed = [
          ...takeCompleted(reminders.filter((reminder) => reminder.kind === "medication"), ratios.medication[index]),
          ...takeCompleted(reminders.filter((reminder) => reminder.kind === "activity"), ratios.activity[index]),
        ]
        return completed.map<ReminderCompletion>((reminder) => ({
          key: reminder.key,
          completedAt: combineDateAndTime(reminder.date, reminder.time),
        }))
      })
    })
    .reduce<Record<string, ReminderCompletion>>((accumulator, completion) => ({ ...accumulator, [completion.key]: completion }), {})
}

export const mockCompletions: Record<string, ReminderCompletion> = buildCompletions()

export const mockFeedbackEntries: FeedbackEntry[] = [
  {
    id: "fb-p-002-1",
    patientId: "p-002",
    category: "side-effect",
    message: "Sering mual dan perut perih setelah minum metformin pagi, jadi kadang saya tunda minumnya.",
    status: "open",
    createdAt: daysFromToday(-1, "08:15"),
  },
]
