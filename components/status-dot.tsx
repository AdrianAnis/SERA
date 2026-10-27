import { cn } from "@/lib/utils"

export type StatusTone = "success" | "warning" | "destructive" | "primary" | "muted"

type StatusDotProps = {
  tone: StatusTone
  label: string
}

const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  primary: "bg-primary",
  muted: "bg-muted-foreground/50",
}

export function StatusDot({ tone, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("size-2 shrink-0 rounded-full", TONE_CLASS[tone])} aria-hidden="true" />
      {label}
    </span>
  )
}
