"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { BrandLogo } from "@/components/brand-logo"
import { FloatingField } from "@/components/floating-field"
import { SocialLoginButtons } from "@/components/patient/social-login-buttons"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  patientSignInSchema,
  patientSignUpSchema,
  type PatientSignInValues,
  type PatientSignUpValues,
} from "@/features/auth/schema"
import { useAuthStore } from "@/features/auth/store"
import { authApi, ApiError, type AuthResponse } from "@/lib/api"
import { routes } from "@/lib/routes"

type AuthMode = "signup" | "signin"

const SUBMIT_BUTTON_CLASS = "mt-4 h-14 w-full rounded-full type-heading shadow-xl shadow-primary/25"

type SignUpFormProps = {
  onSuccess: (response: AuthResponse) => void
  onError: (msg: string) => void
}

function SignUpForm({ onSuccess, onError }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<PatientSignUpValues>({
    resolver: zodResolver(patientSignUpSchema),
    defaultValues: { name: "", email: "", password: "", hasAcceptedTerms: true },
  })

  async function handleSubmit(values: PatientSignUpValues): Promise<void> {
    setIsLoading(true)
    try {
      const response = await authApi.registerPatient(values)
      onSuccess(response)
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.userMessage)
      } else {
        onError((err as Error).message || "Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
        <FloatingField control={form.control} name="name" label="Nama" placeholder="Masukkan nama lengkap" autoComplete="name" />
        <FloatingField control={form.control} name="email" label="Email" placeholder="Masukkan email" type="email" autoComplete="email" />
        <FloatingField control={form.control} name="password" label="Password" placeholder="Masukkan password" type="password" autoComplete="new-password" />
        <FormField
          control={form.control}
          name="hasAcceptedTerms"
          render={({ field }) => (
            <FormItem className="gap-1 px-1">
              <div className="flex items-center gap-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="size-5 rounded border-border accent-primary"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-muted-foreground">Saya menyetujui semua syarat dan ketentuan</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className={SUBMIT_BUTTON_CLASS}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </form>
    </Form>
  )
}

function SignInForm({ onSuccess, onError }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<PatientSignInValues>({
    resolver: zodResolver(patientSignInSchema),
    defaultValues: { email: "", password: "" },
  })

  async function handleSubmit(values: PatientSignInValues): Promise<void> {
    setIsLoading(true)
    try {
      const response = await authApi.loginPatient(values)
      onSuccess(response)
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.userMessage)
      } else {
        onError((err as Error).message || "Failed to sign in. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
        <FloatingField control={form.control} name="email" label="Email" placeholder="Masukkan email" type="email" autoComplete="email" />
        <FloatingField control={form.control} name="password" label="Password" placeholder="Masukkan password" type="password" autoComplete="current-password" />
        <Button type="submit" disabled={isLoading} className={SUBMIT_BUTTON_CLASS}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>
    </Form>
  )
}

export function AuthView() {
  const router = useRouter()
  const loginPatient = useAuthStore((state) => state.loginPatient)
  const [mode, setMode] = useState<AuthMode>("signup")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSignUp = mode === "signup"

  function handleAuthenticated(response: AuthResponse): void {
    setErrorMessage(null)
    loginPatient({
      userId: response.user.id,
      patientId: response.user.patientId,
      token: response.token,
      email: response.user.email,
      name: response.user.name,
    })
    router.replace(routes.patient.today)
  }

  function handleSocialDemo(): void {
    loginPatient()
    router.replace(routes.patient.today)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background md:flex-row">
      <div className="relative flex flex-col bg-primary px-6 pt-8 pb-16 text-primary-foreground md:w-1/2 md:justify-center md:px-12 md:pb-12 lg:px-24">
        <Link
          href={routes.patient.landing}
          className="mb-8 flex min-h-11 items-center text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground md:absolute md:top-8 md:left-12 md:mb-0 lg:left-24"
        >
          <ChevronLeft className="mr-1 size-5" />
          Kembali
        </Link>
        <BrandLogo size="lg" isInverted className="md:mb-8" />
        <div className="hidden md:block">
          <h1 className="mb-6 type-display text-primary-foreground">Mulai langkah sehat Anda hari ini.</h1>
          <p className="max-w-md text-base text-primary-foreground/80">
            Masuk untuk mengakses rencana perawatan yang disesuaikan khusus untuk Anda oleh dokter terpercaya.
          </p>
        </div>
      </div>

      <div className="relative -mt-10 flex w-full flex-1 flex-col justify-center rounded-t-[2rem] bg-card px-6 pt-8 pb-8 shadow-xl md:mt-0 md:w-1/2 md:rounded-none md:rounded-l-[3rem] md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center md:text-left">
            <h2 className="mb-2 type-title">{isSignUp ? "Daftar sekarang" : "Selamat datang"}</h2>
            <p className="text-muted-foreground">
              {isSignUp ? "Daftar untuk mengatur dan mengembangkan rutinitas sehat bersama kami" : "Masuk untuk melanjutkan rencana perawatan Anda"}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSignUp ? (
            <SignUpForm onSuccess={handleAuthenticated} onError={(msg) => setErrorMessage(msg)} />
          ) : (
            <SignInForm onSuccess={handleAuthenticated} onError={(msg) => setErrorMessage(msg)} />
          )}

          <div className="mt-6">
            <div className="relative mb-6 flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-border" />
              <span className="relative bg-card px-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Atau {isSignUp ? "daftar" : "masuk"} dengan
              </span>
            </div>
            <SocialLoginButtons onSelect={handleSocialDemo} />
            <p className="mt-6 text-center type-caption">
              {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null)
                  setMode(isSignUp ? "signin" : "signup")
                }}
                className="min-h-11 font-semibold text-primary hover:underline"
              >
                {isSignUp ? "Masuk" : "Daftar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
