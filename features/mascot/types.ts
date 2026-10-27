export type MascotPose =
  | "greeting"
  | "excited"
  | "surprised"
  | "wink"
  | "love"
  | "thinking"
  | "sleepy"
  | "happy"
  | "angry"
  | "sad"
  | "dizzy"
  | "grateful"
  | "clipboard"
  | "shy"
  | "worried"
  | "proud"

export type DayPart = "morning" | "day" | "night"

export type AchievementId = "first-complete-day" | "three-day-streak" | "steady-week"

export type Achievement = {
  id: AchievementId
  isUnlocked: boolean
}
