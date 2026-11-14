"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  HeartPulse,
  Loader2,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react"

import { MascotAvatar } from "@/components/patient/mascot-avatar"
import { RingOrnament } from "@/components/ring-ornament"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store"
import { consultationApi, type DoctorWithStatus } from "@/lib/api"
import { routes } from "@/lib/routes"

export function DoctorProfileView() {
  const router = useRouter()
  const params = useParams()
  const doctorId = params.id as string
  const patientSession = useAuthStore((state) => state.patient)

  const [doctor, setDoctor] = useState<DoctorWithStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadDoctor() {
      try {
        setIsLoading(true)
        const data = await consultationApi.getDoctorDetail(doctorId, patientSession?.token)
        if (isMounted) setDoctor(data)
      } catch (err) {
        console.error("Gagal memuat detail dokter:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (doctorId) {
      void loadDoctor()
    }

    return () => {
      isMounted = false
    }
  }, [doctorId, patientSession?.token])

  async function handleToggleConsultation() {
    if (!doctor) return
    setActionLoading(true)
    setNotice(null)

    try {
      if (doctor.consultationStatus === "pending" && doctor.activeRequestId) {
        // Cancel consultation
        await consultationApi.cancelConsultation(doctor.activeRequestId, patientSession?.token)
        setDoctor((prev) =>
          prev ? { ...prev, consultationStatus: "none", activeRequestId: null } : null
        )
        setNotice({
          type: "success",
          text: "Permintaan konsultasi berhasil dibatalkan.",
        })
      } else if (doctor.consultationStatus === "none" || doctor.consultationStatus === "rejected") {
        // Request consultation
        const res = await consultationApi.requestConsultation(
          doctor.id,
          "Permintaan konsultasi awal dari pasien.",
          patientSession?.token
        )
        setDoctor((prev) =>
          prev
            ? {
                ...prev,
                consultationStatus: "pending",
                activeRequestId: res.id,
              }
            : null
        )
        setNotice({
          type: "success",
          text: "Permintaan konsultasi berhasil dikirim ke dokter!",
        })
      }
    } catch (err) {
      console.error("Gagal memperbarui status konsultasi:", err)
      setNotice({
        type: "error",
        text: (err as Error).message || "Gagal memproses permintaan konsultasi.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Memuat profil dokter...</p>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="space-y-4 rounded-3xl border bg-card p-12 text-center shadow-sm">
        <Stethoscope className="mx-auto size-12 text-muted-foreground/60" />
        <h2 className="type-title">Dokter tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground">
          Dokter yang Anda cari tidak tersedia atau ID tidak valid.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href={routes.patient.doctors}>Kembali ke Daftar Dokter</Link>
        </Button>
      </div>
    )
  }

  const isPending = doctor.consultationStatus === "pending"
  const isApproved = doctor.consultationStatus === "approved"

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={routes.patient.doctors}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Cari Dokter
      </Link>

      {notice ? (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-sm font-medium shadow-sm animate-in fade-in ${
            notice.type === "success"
              ? "border-emerald-500/30 bg-emerald-50/80 text-emerald-900"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : (
              <X className="size-4 text-destructive" />
            )}
            <span>{notice.text}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setNotice(null)}
            className="size-7 p-0 rounded-full"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {/* LinkedIn-style Profile Card */}
      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Cover Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-r from-primary via-primary/85 to-sky-600 p-6 text-primary-foreground sm:h-52">
          <RingOrnament />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              Sera Clinician Network
            </span>
          </div>
        </div>

        {/* Profile Details (Overlapping avatar) */}
        <div className="relative px-6 pb-8 pt-0 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <div className="-mt-16 sm:-mt-20 relative size-28 sm:size-36 shrink-0 overflow-hidden rounded-3xl border-4 border-card bg-card shadow-lg">
              {doctor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full shadow-inner">
                  <MascotAvatar className="size-full" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {isApproved ? (
                <Button
                  disabled
                  className="rounded-full bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15 border border-emerald-500/30 gap-2 px-5 font-semibold text-sm cursor-not-allowed"
                >
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Consulted
                </Button>
              ) : isPending ? (
                <Button
                  variant="outline"
                  disabled={actionLoading}
                  onClick={handleToggleConsultation}
                  className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 gap-2 px-5 font-semibold text-sm shadow-sm"
                >
                  {actionLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                  Batalkan Konsultasi
                </Button>
              ) : (
                <Button
                  disabled={actionLoading}
                  onClick={handleToggleConsultation}
                  className="rounded-full gap-2 px-6 font-semibold text-sm shadow-sm"
                >
                  {actionLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Ajukan Konsultasi
                </Button>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="type-title text-foreground">{doctor.name}</h1>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary gap-1.5 px-3 py-1 text-xs font-semibold">
                <Stethoscope className="size-3" />
                {doctor.specialty}
              </Badge>
            </div>

            <p className="text-sm font-medium text-foreground/85">
              Dokter Spesialis di {doctor.hospital}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                {doctor.hospital}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                {doctor.email}
              </span>
              {doctor.phone ? (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  {doctor.phone}
                </span>
              ) : null}
            </div>

            {isPending ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900">
                <Clock className="size-4 shrink-0 text-amber-600" />
                <span>
                  Permintaan konsultasi Anda telah dikirim dan sedang menunggu konfirmasi dari dokter di sistem rumah sakit.
                </span>
              </div>
            ) : isApproved ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-900">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>
                  Anda telah terhubung dengan dokter ini. Dokter dapat mengelola Care Plan dan memantau kepatuhan rutinitas kesehatan Anda.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="type-heading flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Tentang Dokter
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {doctor.bio ||
            `${doctor.name} merupakan dokter spesialis di bidang ${doctor.specialty} yang berpraktik di ${doctor.hospital}. Beliau aktif mendampingi pasien dalam perencanaan terapi, kepatuhan gaya hidup sehat, dan pemantauan kondisi klinis berkala.`}
        </p>
      </section>

      {/* Practice Details */}
      <section className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="type-heading flex items-center gap-2">
          <HeartPulse className="size-5 text-primary" />
          Layanan & Pemantauan Digital Sera
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <h3 className="font-semibold text-sm">Care Plan Personal</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Dokter menyusun jadwal minum obat, aktivitas fisik, dan target nutrisi yang terhubung langsung ke aplikasi Anda.
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <h3 className="font-semibold text-sm">Evaluasi Kepatuhan Klinis</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Progres harian Anda dipantau oleh dokter untuk menentukan penyesuaian dosis atau tindak lanjut konsultasi berikutnya.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

