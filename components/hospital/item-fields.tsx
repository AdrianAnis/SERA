"use client"

import type { ChangeEvent } from "react"
import { Controller, type Path, type UseFormReturn } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DIET_RULE_LABEL } from "@/features/care-plan/labels"
import type { CarePlanFormValues } from "@/features/care-plan/schema"
import type { CarePlanItemKind } from "@/features/care-plan/types"
import { assertNever } from "@/lib/utils"

type ItemFieldsProps = {
  form: UseFormReturn<CarePlanFormValues>
  index: number
  kind: CarePlanItemKind
  onEdit: () => void
}

type FieldKind = "text" | "list" | "number" | "nullable-number"

type FieldProps = {
  form: UseFormReturn<CarePlanFormValues>
  name: Path<CarePlanFormValues>
  label: string
  onEdit: () => void
  inputType?: string
  valueKind?: FieldKind
}

function parseNumber(value: unknown): number {
  return typeof value === "string" || typeof value === "number" ? Number(value) : Number.NaN
}

function convertValue(valueKind: FieldKind, value: unknown): unknown {
  switch (valueKind) {
    case "list":
      return String(value).split(",").map((part) => part.trim()).filter(Boolean)
    case "number":
      return parseNumber(value)
    case "nullable-number":
      return value === "" || value === null ? null : parseNumber(value)
    case "text":
      return value
    default:
      return assertNever(valueKind)
  }
}

function Field({ form, name, label, onEdit, inputType = "text", valueKind = "text" }: FieldProps) {
  const registration = form.register(name, { setValueAs: (value: unknown) => convertValue(valueKind, value) })
  const error = form.getFieldState(name, form.formState).error?.message
  const id = `field-${name}`

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onEdit()
    void registration.onChange(event)
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={inputType} aria-invalid={Boolean(error)} {...registration} onChange={handleChange} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

export function ItemFields({ form, index, kind, onEdit }: ItemFieldsProps) {
  const base = { form, onEdit }
  const instructionField = <Field {...base} name={`items.${index}.instruction`} label="Instruksi untuk pasien" />

  switch (kind) {
    case "medication":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field {...base} name={`items.${index}.drug`} label="Nama obat" />
          <Field {...base} name={`items.${index}.dose`} label="Dosis" />
          <Field {...base} name={`items.${index}.times`} label="Jam minum (pisahkan koma)" valueKind="list" />
          <Field {...base} name={`items.${index}.durationDays`} label="Lama minum (hari)" inputType="number" valueKind="number" />
          <div className="sm:col-span-2">{instructionField}</div>
        </div>
      )
    case "diet":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field {...base} name={`items.${index}.category`} label="Kategori makanan" />
          <div className="space-y-1.5">
            <Label htmlFor={`field-items.${index}.rule`}>Aturan</Label>
            <Controller
              control={form.control}
              name={`items.${index}.rule`}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    onEdit()
                    field.onChange(value)
                  }}
                >
                  <SelectTrigger id={`field-items.${index}.rule`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DIET_RULE_LABEL).map(([rule, label]) => (
                      <SelectItem key={rule} value={rule}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="sm:col-span-2">{instructionField}</div>
        </div>
      )
    case "activity":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field {...base} name={`items.${index}.activity`} label="Aktivitas" />
          <Field {...base} name={`items.${index}.frequencyPerWeek`} label="Kali per minggu" inputType="number" valueKind="number" />
          <Field {...base} name={`items.${index}.durationMinutes`} label="Durasi (menit)" inputType="number" valueKind="number" />
          <div className="sm:col-span-3">{instructionField}</div>
        </div>
      )
    case "restriction":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field {...base} name={`items.${index}.subject`} label="Yang dibatasi" />
          <Field {...base} name={`items.${index}.durationDays`} label="Lama (hari, kosong = selama pengobatan)" inputType="number" valueKind="nullable-number" />
          <div className="sm:col-span-2">{instructionField}</div>
        </div>
      )
    case "followUp":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field {...base} name={`items.${index}.date`} label="Tanggal kontrol" inputType="date" />
          {instructionField}
        </div>
      )
    default:
      return assertNever(kind)
  }
}
