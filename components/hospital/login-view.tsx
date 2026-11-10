"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { BrandLogo } from "@/components/brand-logo"
import { FloatingField } from "@/components/floating-field"
import { RingOrnament } from "@/components/ring-ornament"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { doctorLoginSchema, type DoctorLoginValues } from "@/features/auth/schema"
import { useAuthStore } from "@/features/auth/store"
import { authApi, ApiError } from "@/lib/api"
import { routes } from "@/lib/routes"

export function LoginView() {
  const router = useRouter()
  const loginDoctor = useAuthStore((state) => state.loginDoctor)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DoctorLoginValues>({
    resolver: zodResolver(doctorLoginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) setErrorMessage(null)
    })
    return () => subscription.unsubscribe()
  }, [form, errorMessage])

  async function handleSubmit(values: DoctorLoginValues): Promise<void> {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const response = await authApi.loginDoctor(values)

      // Simpan session dokter
      loginDoctor({
        userId: response.user.doctorId || response.user.id,
        token: response.token,
        email: response.user.email,
        name: response.user.name,
      })

      router.replace(routes.hospital.dashboard)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.userMessage)
      } else {
        setErrorMessage((err as Error).message || "Failed to sign in. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <RingOrnament />
        <Link href={routes.hospital.landing} className="relative flex min-h-11 w-fit items-center gap-1 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground">
          <ChevronLeft className="size-5" />
          Kembali ke beranda
        </Link>
        <div className="relative space-y-4">
          <BrandLogo size="lg" isInverted />
          <h1 className="type-display text-primary-foreground">Workspace dokter</h1>
          <p className="max-w-md text-primary-foreground/80">
            Susun, konfirmasi, dan pantau care plan pasien Anda. Perubahan langsung diterima pasien di aplikasi mereka.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/70">Sera untuk Dokter</p>
      </div>

      <div className="flex items-center justify-center bg-card px-4 py-10 md:px-12">
        <div className="w-full max-w-md space-y-6">
          <Link href={routes.hospital.landing} className="flex min-h-11 w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden">
            <ChevronLeft className="size-5" />
            Kembali
          </Link>
          <div className="space-y-1">
            <h2 className="type-title">Masuk</h2>
            <p className="type-caption">Gunakan email rumah sakit Anda.</p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive" role="alert">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FloatingField
                control={form.control}
                name="email"
                label="Email"
                placeholder="nama@rumahsakit.id"
                type="email"
                autoComplete="email"
              />
              <FloatingField
                control={form.control}
                name="password"
                label="Kata sandi"
                placeholder="Masukkan kata sandi"
                type="password"
                autoComplete="current-password"
              />
              <Button type="submit" size="lg" disabled={isLoading} className="h-12 w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
