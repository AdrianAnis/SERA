import { cn } from "@/lib/utils"

type ScheduleProgressProps = {
  done: number
  total: number
}

export function ScheduleProgress({ done, total }: ScheduleProgressProps) {
  if (total === 0) return null

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={cn("size-3 rounded-full", index < done ? "bg-success" : "bg-border")} />
        ))}
      </div>
      <p className="type-caption">
        <strong className="text-foreground">
          {done} dari {total} jadwal
        </strong>{" "}
        hari ini sudah kamu tandai
      </p>
    </div>
  )
}
