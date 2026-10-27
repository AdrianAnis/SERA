import type { Achievement, DayPart } from "@/features/mascot/types"
import type { AdherenceDay } from "@/features/reminder/selectors"
import { selectAdherenceRatio } from "@/features/reminder/selectors"

const MORNING_END_HOUR = 11
const NIGHT_START_HOUR = 18
const STREAK_TARGET_DAYS = 3
const STEADY_WEEK_RATIO = 0.8

function isCompleteDay(day: AdherenceDay): boolean {
  return day.total > 0 && day.done === day.total
}

export function selectCompleteDayStreak(days: AdherenceDay[]): number {
  const today = days[days.length - 1]
  const settledDays = today && !isCompleteDay(today) ? days.slice(0, -1) : days
  let streak = 0
  for (let index = settledDays.length - 1; index >= 0; index -= 1) {
    const day = settledDays[index]
    if (!day || !isCompleteDay(day)) break
    streak += 1
  }
  return streak
}

export function selectAchievements(days: AdherenceDay[]): Achievement[] {
  const ratio = selectAdherenceRatio(days)
  return [
    { id: "first-complete-day", isUnlocked: days.some(isCompleteDay) },
    { id: "three-day-streak", isUnlocked: selectCompleteDayStreak(days) >= STREAK_TARGET_DAYS },
    { id: "steady-week", isUnlocked: ratio !== null && ratio >= STEADY_WEEK_RATIO },
  ]
}

export function selectDayPart(now: Date): DayPart {
  const hour = now.getHours()
  if (hour < MORNING_END_HOUR) return "morning"
  return hour >= NIGHT_START_HOUR ? "night" : "day"
}
