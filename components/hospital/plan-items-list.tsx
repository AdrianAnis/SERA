import { CARE_PLAN_KIND_ICON } from "@/components/care-plan-kind-icons"
import { getItemSummary, getItemTitle } from "@/features/care-plan/describe"
import { CARE_PLAN_ITEM_KIND_LABEL, CARE_PLAN_KIND_ORDER } from "@/features/care-plan/labels"
import { selectItemsByKind } from "@/features/care-plan/selectors"
import type { CarePlan } from "@/features/care-plan/types"

type PlanItemsListProps = {
  plan: CarePlan
}

export function PlanItemsList({ plan }: PlanItemsListProps) {
  return (
    <div className="-mb-5 lg:mb-0 lg:columns-2 lg:gap-x-6">
      {CARE_PLAN_KIND_ORDER.map((kind) => {
        const items = selectItemsByKind(plan, kind)
        if (items.length === 0) return null
        const KindIcon = CARE_PLAN_KIND_ICON[kind]
        return (
          <section key={kind} className="mb-6 break-inside-avoid space-y-2.5">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KindIcon className="size-4" />
              </span>
              {CARE_PLAN_ITEM_KIND_LABEL[kind]}
              <span className="font-normal text-muted-foreground">{items.length}</span>
            </h3>
            <ul className="divide-y rounded-xl border">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <p className="text-sm font-medium">{getItemTitle(item)}</p>
                  <p className="type-caption">{getItemSummary(item)}</p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
