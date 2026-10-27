"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { CARE_PLAN_KIND_ICON } from "@/components/care-plan-kind-icons"
import { BuilderInstructionPanel } from "@/components/hospital/builder-instruction-panel"
import { BuilderItemCard } from "@/components/hospital/builder-item-card"
import { BuilderSummaryPanel } from "@/components/hospital/builder-summary-panel"
import { ConfirmPlanDialog } from "@/components/hospital/confirm-plan-dialog"
import { Button } from "@/components/ui/button"
import { generateDraftItems } from "@/features/care-plan/ai-draft"
import { diffCarePlanItems } from "@/features/care-plan/diff"
import { createBlankItem, createItemId } from "@/features/care-plan/factory"
import { CARE_PLAN_ITEM_KIND_LABEL, CARE_PLAN_KIND_ORDER } from "@/features/care-plan/labels"
import { carePlanFormSchema, type CarePlanFormValues } from "@/features/care-plan/schema"
import { useCarePlanStore } from "@/features/care-plan/store"
import type { CarePlan, CarePlanItemKind } from "@/features/care-plan/types"
import type { Doctor, Patient } from "@/features/patient/types"
import { routes } from "@/lib/routes"

const AI_DELAY_MS = 1200

type CarePlanBuilderProps = {
  patient: Patient
  doctor: Doctor
  activePlan: CarePlan | undefined
  nextVersion: number
}

function buildDefaultValues(activePlan: CarePlan | undefined): CarePlanFormValues {
  if (activePlan) {
    return {
      sourceText: activePlan.sourceText,
      items: activePlan.items.map((item) => ({ ...item, id: createItemId(item.kind), aiSuggested: false })),
    }
  }
  return { sourceText: "", items: [] }
}

function countByKind(items: CarePlanFormValues["items"]): Record<CarePlanItemKind, number> {
  const counts: Record<CarePlanItemKind, number> = { medication: 0, diet: 0, activity: 0, restriction: 0, followUp: 0 }
  items.forEach((item) => {
    counts[item.kind] += 1
  })
  return counts
}

export function CarePlanBuilder({ patient, doctor, activePlan, nextVersion }: CarePlanBuilderProps) {
  const router = useRouter()
  const publishPlan = useCarePlanStore((state) => state.publishPlan)
  const form = useForm<CarePlanFormValues>({
    resolver: zodResolver(carePlanFormSchema),
    mode: "onChange",
    defaultValues: buildDefaultValues(activePlan),
  })
  const { fields, append, remove, replace } = useFieldArray({ control: form.control, name: "items" })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const timerRef = useRef<number | null>(null)

  const items = useWatch({ control: form.control, name: "items" })
  const versionLabel = `v${nextVersion}`
  const hasPendingAiItems = items.some((item) => item.aiSuggested)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  function handleGenerate(): void {
    const text = form.getValues("sourceText")
    if (!text.trim()) {
      void form.trigger("sourceText")
      return
    }
    setIsGenerating(true)
    timerRef.current = window.setTimeout(() => {
      replace(generateDraftItems(text))
      setIsGenerating(false)
      void form.trigger()
    }, AI_DELAY_MS)
  }

  function publish(values: CarePlanFormValues): void {
    publishPlan({ patientId: patient.id, createdBy: doctor.id, sourceText: values.sourceText.trim(), items: values.items })
    toast.success(`Sesi selesai. Care plan ${versionLabel} dikirim ke ${patient.name}`)
    router.push(routes.hospital.patientDetail(patient.id))
  }

  const itemsError = form.formState.errors.items?.message ?? form.formState.errors.items?.root?.message

  return (
    <div className="grid items-start gap-6 p-4 md:p-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <BuilderInstructionPanel form={form} isGenerating={isGenerating} onGenerate={handleGenerate} />

        {CARE_PLAN_KIND_ORDER.map((kind) => {
          const kindFields = fields.map((field, index) => ({ field, index })).filter(({ field }) => field.kind === kind)
          const KindIcon = CARE_PLAN_KIND_ICON[kind]
          return (
            <section key={kind} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <KindIcon className="size-4" />
                  </span>
                  {CARE_PLAN_ITEM_KIND_LABEL[kind]} <span className="font-normal text-muted-foreground">{kindFields.length}</span>
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={() => append(createBlankItem(kind))}>
                  <Plus />
                  Tambah
                </Button>
              </div>
              {kindFields.length === 0 ? (
                <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">Belum ada item {CARE_PLAN_ITEM_KIND_LABEL[kind].toLowerCase()}.</p>
              ) : (
                kindFields.map(({ field, index }) => (
                  <BuilderItemCard
                    key={field.id}
                    form={form}
                    index={index}
                    kind={kind}
                    isAiSuggested={items[index]?.aiSuggested === true}
                    onRemove={() => remove(index)}
                  />
                ))
              )}
            </section>
          )
        })}
        {itemsError ? <p className="text-sm text-destructive">{itemsError}</p> : null}
      </div>

      <div>
        <BuilderSummaryPanel
          versionLabel={versionLabel}
          counts={countByKind(items)}
          isValid={form.formState.isValid}
          hasPendingAiItems={hasPendingAiItems}
          onFinishSession={() => setIsConfirmOpen(true)}
        />
      </div>

      <ConfirmPlanDialog
        isOpen={isConfirmOpen}
        versionLabel={versionLabel}
        patientName={patient.name}
        changes={isConfirmOpen ? diffCarePlanItems(activePlan?.items ?? [], items) : []}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => void form.handleSubmit(publish)()}
      />
    </div>
  )
}
