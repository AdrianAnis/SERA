"use client"

import { Check, Sparkles, Trash2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { ItemFields } from "@/components/hospital/item-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CarePlanFormValues } from "@/features/care-plan/schema"
import type { CarePlanItemKind } from "@/features/care-plan/types"
import { cn } from "@/lib/utils"

type BuilderItemCardProps = {
  form: UseFormReturn<CarePlanFormValues>
  index: number
  kind: CarePlanItemKind
  isAiSuggested: boolean
  onRemove: () => void
}

export function BuilderItemCard({ form, index, kind, isAiSuggested, onRemove }: BuilderItemCardProps) {
  function markApproved(): void {
    form.setValue(`items.${index}.aiSuggested`, false)
  }

  return (
    <div className={cn("space-y-4 rounded-2xl border bg-card p-5", isAiSuggested && "border-primary/50 bg-primary/5")}>
      <div className="flex items-center justify-between gap-2">
        {isAiSuggested ? (
          <div className="flex items-center gap-2">
            <Badge className="gap-1">
              <Sparkles className="size-3" />
              Disarankan AI
            </Badge>
            <Button type="button" variant="ghost" size="xs" onClick={markApproved}>
              <Check />
              Setujui
            </Button>
          </div>
        ) : (
          <span />
        )}
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Hapus item" onClick={onRemove}>
          <Trash2 />
        </Button>
      </div>
      <ItemFields form={form} index={index} kind={kind} onEdit={markApproved} />
    </div>
  )
}
