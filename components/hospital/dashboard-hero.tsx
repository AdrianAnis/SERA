import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { RingOrnament } from "@/components/ring-ornament"
import { Button } from "@/components/ui/button"
import { formatDate, getGreeting } from "@/lib/date"

type DashboardHeroProps = {
  doctorName: string
  now: Date
  action: { href: string; label: string }
}

export function DashboardHero({ doctorName, now, action }: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground md:p-8">
      <RingOrnament />
      <p className="relative type-overline text-primary-foreground/80">{formatDate(now, "EEEE, d MMMM yyyy")}</p>
      <h1 className="relative mt-2 type-title text-primary-foreground">
        {getGreeting(now)}, {doctorName}
      </h1>
      <Button asChild size="lg" className="relative mt-5 h-11 bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90">
        <Link href={action.href}>
          {action.label}
          <ArrowRight />
        </Link>
      </Button>
    </section>
  )
}
