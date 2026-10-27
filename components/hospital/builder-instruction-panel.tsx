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
        <CardTitle>Instruksi dokter</CardTitle>
        <CardDescription>
          Tulis instruksi seperti biasa, lalu susun otomatis menjadi item terstruktur. Hasil susunan AI baru dikirim ke pasien setelah Anda menyelesaikan sesi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="source-text" className="sr-only">
          Instruksi dokter
        </Label>
        <Textarea
          id="source-text"
          rows={4}
          placeholder="Contoh: Amlodipin 5 mg sekali sehari pagi selama 30 hari. Hindari makanan tinggi garam. Jalan kaki 30 menit 5x seminggu. Kontrol 2 minggu lagi."
          aria-invalid={Boolean(error)}
          {...form.register("sourceText")}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Menyusun item..." : "Susun dengan AI"}
        </Button>
      </CardContent>
    </Card>
  )
}
