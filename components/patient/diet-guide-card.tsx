import Link from "next/link"
import { Salad } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DIET_RULE_LABEL } from "@/features/care-plan/labels"
import type { DietItem } from "@/features/care-plan/types"
import { routes } from "@/lib/routes"

type DietGuideCardProps = {
  items: DietItem[]
}

const RULE_BADGE_VARIANT: Record<DietItem["rule"], "destructive" | "secondary" | "default"> = {
  avoid: "destructive",
  limit: "secondary",
  recommend: "default",
}

export function DietGuideCard({ items }: DietGuideCardProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Salad className="size-5" />
        </span>
        <h2 className="type-subheading">Panduan makanan</h2>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Dokter belum menetapkan anjuran makanan.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <Badge variant={RULE_BADGE_VARIANT[item.rule]}>{DIET_RULE_LABEL[item.rule]}</Badge>
              <Link href={routes.patient.carePlanItem(item.id)} className="font-semibold hover:underline">
                {item.category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
