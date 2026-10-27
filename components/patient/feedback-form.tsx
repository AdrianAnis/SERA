"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { feedbackFormSchema, type FeedbackFormValues } from "@/features/feedback/schema"
import { FEEDBACK_CATEGORY_LABEL } from "@/features/feedback/labels"
import { FEEDBACK_CATEGORIES } from "@/features/feedback/types"

type FeedbackFormProps = {
  onSubmit: (values: FeedbackFormValues) => void
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: { message: "" },
  })

  function handleValidSubmit(values: FeedbackFormValues): void {
    onSubmit(values)
    form.reset({ message: "" })
    toast.success("Laporan terkirim ke dokter kamu")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis laporan</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih jenis laporan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FEEDBACK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {FEEDBACK_CATEGORY_LABEL[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ceritakan kendala atau keluhan kamu</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Contoh: pusing setelah minum obat pagi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="h-12 w-full text-base">
          Kirim ke dokter
        </Button>
      </form>
    </Form>
  )
}
