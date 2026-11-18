"use client"

import { Loader2, Sparkles } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CarePlanFormValues } from "@/features/care-plan/schema"

type BuilderInstructionPanelProps = {
  form: UseFormReturn<CarePlanFormValues>
  isGenerating: boolean
  onGenerate: () => void
}

export function BuilderInstructionPanel({ form, isGenerating, onGenerate }: BuilderInstructionPanelProps) {
  const error = form.getFieldState("sourceText", form.formState).error?.message

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor instructions</CardTitle>
        <CardDescription>
          Write instructions as usual, then turn them into structured items automatically. AI results are only sent to the patient after you finish the session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="source-text" className="sr-only">
          Doctor instructions
        </Label>
        <Textarea
          id="source-text"
          rows={4}
          placeholder="Example: Amlodipin 5 mg sekali sehari pagi selama 30 hari. Hindari makanan tinggi garam. Jalan kaki 30 menit 5x seminggu. Kontrol 2 minggu lagi."
          aria-invalid={Boolean(error)}
          {...form.register("sourceText")}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Generating items..." : "Generate with AI"}
        </Button>
      </CardContent>
    </Card>
  )
}
