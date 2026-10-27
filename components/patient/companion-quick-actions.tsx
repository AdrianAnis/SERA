import { CalendarPlus, CalendarCheck, MessageSquareWarning, Pill, Salad, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { QUICK_ACTIONS, type QuickActionKey } from "@/features/companion/scenarios"

type CompanionQuickActionsProps = {
  isDisabled: boolean
  onSelect: (message: string) => void
}

const ACTION_ICON: Record<QuickActionKey, LucideIcon> = {
  consultation: CalendarPlus,
  complaint: MessageSquareWarning,
  medication: Pill,
  diet: Salad,
  "follow-up": CalendarCheck,
}

export function CompanionQuickActions({ isDisabled, onSelect }: CompanionQuickActionsProps) {
  return (
    <ul aria-label="Pesan cepat" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
      {QUICK_ACTIONS.map((action) => {
        const Icon = ACTION_ICON[action.key]
        return (
          <li key={action.key} className="shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDisabled}
              onClick={() => onSelect(action.message)}
              className="h-10 rounded-full bg-card px-4 shadow-sm"
            >
              <Icon className="text-primary" />
              {action.label}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
