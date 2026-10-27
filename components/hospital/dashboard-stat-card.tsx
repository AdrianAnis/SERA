import Link from "next/link"
import type { LucideIcon } from "lucide-react"

type DashboardStatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  href: string
}

export function DashboardStatCard({ icon: Icon, label, value, href }: DashboardStatCardProps) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl leading-none font-semibold tabular-nums">{value}</p>
        <p className="mt-1.5 type-caption">{label}</p>
      </div>
    </Link>
  )
}
