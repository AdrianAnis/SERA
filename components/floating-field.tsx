"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type FloatingFieldProps<TValues extends FieldValues> = {
  control: Control<TValues>
  name: FieldPath<TValues>
  label: string
  placeholder: string
  type?: "text" | "email" | "password"
  autoComplete?: string
}

export function FloatingField<TValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: FloatingFieldProps<TValues>) {
  const [isVisible, setIsVisible] = useState(false)
  const isPassword = type === "password"

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative mt-2 gap-1">
          <FormLabel className="absolute -top-2.5 left-4 z-10 bg-card px-1.5 type-overline">
            {label}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type={isPassword && isVisible ? "text" : type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="h-14 rounded-2xl border-border bg-transparent px-5 pr-12 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </FormControl>
            {isPassword ? (
              <button
                type="button"
                aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setIsVisible(!isVisible)}
                className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground"
              >
                {isVisible ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            ) : null}
          </div>
          <FormMessage className="px-1" />
        </FormItem>
      )}
    />
  )
}
