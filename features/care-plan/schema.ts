import { z } from "zod"

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time format must be HH:mm")
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date format must be yyyy-MM-dd")

const medicationItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("medication"),
  drug: z.string().trim().min(1, "Medication name is required"),
  dose: z.string().trim().min(1, "Dose is required"),
  times: z.array(timeSchema).min(1, "Add at least one dose time"),
  durationDays: z.number().int().positive("Durasi harus lebih dari 0"),
  instruction: z.string().trim(),
  aiSuggested: z.boolean(),
})

const dietItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("diet"),
  category: z.string().trim().min(1, "Category is required"),
  rule: z.enum(["avoid", "limit", "recommend"]),
  instruction: z.string().trim(),
  aiSuggested: z.boolean(),
})

const activityItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("activity"),
  activity: z.string().trim().min(1, "Activity is required"),
  frequencyPerWeek: z.number().int().min(1, "At least once a week").max(7, "At most 7 times a week"),
  durationMinutes: z.number().int().positive("Durasi harus lebih dari 0"),
  instruction: z.string().trim(),
  aiSuggested: z.boolean(),
})

const restrictionItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("restriction"),
  subject: z.string().trim().min(1, "Subject is required"),
  durationDays: z.number().int().positive().nullable(),
  instruction: z.string().trim(),
  aiSuggested: z.boolean(),
})

const followUpItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("followUp"),
  date: dateSchema,
  instruction: z.string().trim(),
  aiSuggested: z.boolean(),
})

const carePlanItemSchema = z.discriminatedUnion("kind", [
  medicationItemSchema,
  dietItemSchema,
  activityItemSchema,
  restrictionItemSchema,
  followUpItemSchema,
])

export const carePlanFormSchema = z.object({
  sourceText: z.string().trim().min(1, "Doctor instructions are required"),
  items: z.array(carePlanItemSchema).min(1, "Care plan must contain at least one item"),
})

export type CarePlanFormValues = z.infer<typeof carePlanFormSchema>
