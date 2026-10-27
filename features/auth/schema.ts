import { z } from "zod"

const emailSchema = z.email("Email tidak valid")

export const doctorLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Kata sandi wajib diisi"),
})

export const patientSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
})

export const patientSignUpSchema = patientSignInSchema.extend({
  name: z.string().trim().min(2, "Mohon isi nama lengkap kamu"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  hasAcceptedTerms: z.boolean().refine((value) => value, "Setujui syarat dan ketentuan untuk lanjut"),
})

export type DoctorLoginValues = z.infer<typeof doctorLoginSchema>

export type PatientSignInValues = z.infer<typeof patientSignInSchema>

export type PatientSignUpValues = z.infer<typeof patientSignUpSchema>
