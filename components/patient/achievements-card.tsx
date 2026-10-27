import { Flame, Lock, Trophy } from "lucide-react"

import { JumpingMascot } from "@/components/patient/jumping-mascot"
import { RingOrnament } from "@/components/ring-ornament"
import { ACHIEVEMENT_COPY } from "@/features/mascot/labels"
import type { Achievement } from "@/features/mascot/types"
import { cn } from "@/lib/utils"

type AchievementsCardProps = {
  streak: number
  achievements: Achievement[]
}

export function AchievementsCard({ streak, achievements }: AchievementsCardProps) {
  const unlockedCount = achievements.filter((achievement) => achievement.isUnlocked).length

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="relative flex items-center gap-5 overflow-hidden bg-primary p-6">
        <RingOrnament />
        <JumpingMascot pose="proud" label="Sapa Sera" className="relative w-20 shrink-0" />
        <div className="relative min-w-0 space-y-2">
          <h2 className="text-xl leading-snug font-semibold text-primary-foreground">Pencapaian</h2>
          <p className="text-sm leading-normal text-primary-foreground">
            {unlockedCount} dari {achievements.length} sudah kamu raih
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium text-primary-foreground">
            <Flame className="size-3.5" />
            {streak} hari beruntun
          </p>
        </div>
      </div>
      <ul className="space-y-4 p-6">
        {achievements.map((achievement) => {
          const copy = ACHIEVEMENT_COPY[achievement.id]
          const Icon = achievement.isUnlocked ? Trophy : Lock
          return (
            <li key={achievement.id} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  achievement.isUnlocked ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className={cn("min-w-0", !achievement.isUnlocked && "opacity-60")}>
                <p className="type-body font-medium">{copy.title}</p>
                <p className="type-caption">{copy.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
