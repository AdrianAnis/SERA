import type { AchievementId, DayPart, MascotPose } from "@/features/mascot/types"

export const ACHIEVEMENT_COPY: Record<AchievementId, { title: string; description: string }> = {
  "first-complete-day": {
    title: "Hari lengkap pertama",
    description: "Semua jadwal dalam satu hari sudah kamu tandai.",
  },
  "three-day-streak": {
    title: "Tiga hari beruntun",
    description: "Tiga hari berturut-turut dengan jadwal lengkap.",
  },
  "steady-week": {
    title: "Seminggu konsisten",
    description: "Lebih dari 80% jadwal ditandai dalam 7 hari terakhir.",
  },
}

export const MASCOT_POSE_SRC: Record<MascotPose, string> = {
  greeting: "/mascot/sera-greeting.png",
  excited: "/mascot/sera-excited.png",
  surprised: "/mascot/sera-surprised.png",
  wink: "/mascot/sera-wink.png",
  love: "/mascot/sera-love.png",
  thinking: "/mascot/sera-thinking.png",
  sleepy: "/mascot/sera-sleepy.png",
  happy: "/mascot/sera-happy.png",
  angry: "/mascot/sera-angry.png",
  sad: "/mascot/sera-sad.png",
  dizzy: "/mascot/sera-dizzy.png",
  grateful: "/mascot/sera-grateful.png",
  clipboard: "/mascot/sera-clipboard.png",
  shy: "/mascot/sera-shy.png",
  worried: "/mascot/sera-worried.png",
  proud: "/mascot/sera-proud.png",
}

export const MASCOT_POSE_BY_DAY_PART: Record<DayPart, MascotPose> = {
  morning: "greeting",
  day: "happy",
  night: "sleepy",
}
