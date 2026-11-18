"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, CheckCircle2, Clock, Loader2, Search, Stethoscope, UserRound } from "lucide-react"

import { MascotAvatar } from "@/components/patient/mascot-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/features/auth/store"
import { consultationApi, type DoctorWithStatus } from "@/lib/api"
import { routes } from "@/lib/routes"

export function DoctorSearchView() {
  const patientSession = useAuthStore((state) => state.patient)
  const [doctors, setDoctors] = useState<DoctorWithStatus[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadDoctors() {
      try {
        setIsLoading(true)
        const data = await consultationApi.getDoctors(searchQuery, patientSession?.token)
        if (isMounted) {
          setDoctors(data)
        }
      } catch (err) {
        console.error("Gagal memuat daftar dokter:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      void loadDoctors()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery, patientSession?.token])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="type-title">Cari Dokter</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Temukan dokter spesialis terpercaya dan ajukan konsultasi langsung agar rencana perawatan Anda dapat dipantau oleh ahlinya.
        </p>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute top-3 left-3.5 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama dokter, spesialisasi, atau rumah sakit..."
          className="rounded-2xl bg-card pl-10 h-11 text-sm shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Memuat daftar dokter spesialis...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-3xl border bg-card p-12 text-center shadow-sm">
          <Stethoscope className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-3 font-semibold text-base">Tidak ada dokter ditemukan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba gunakan kata kunci pencarian lain seperti nama spesialisasi atau rumah sakit.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {doctors.map((doctor) => {
            const isPending = doctor.consultationStatus === "pending"
            const isApproved = doctor.consultationStatus === "approved"

            return (
              <div
                key={doctor.id}
                className="group relative flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {doctor.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        className="size-16 rounded-2xl object-cover border"
                      />
                    ) : (
                      <div className="size-16 rounded-2xl overflow-hidden shadow-inner shrink-0">
                        <MascotAvatar className="size-full" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-semibold text-base group-hover:text-primary transition-colors">
                          {doctor.name}
                        </h2>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Stethoscope className="size-3.5" />
                        <span>{doctor.specialty}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>
                    </div>
                  </div>

                  {doctor.bio ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground/90 leading-relaxed">
                      {doctor.bio}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                  <div>
                    {isPending ? (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 gap-1 text-xs">
                        <Clock className="size-3" />
                        Menunggu Konfirmasi
                      </Badge>
                    ) : isApproved ? (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 gap-1 text-xs">
                        <CheckCircle2 className="size-3" />
                        Sudah Terhubung
                      </Badge>
                    ) : null}
                  </div>

                  <Button asChild size="sm" className="rounded-full px-4 text-xs font-semibold shadow-sm">
                    <Link href={routes.patient.doctorDetail(doctor.id)}>
                      Lihat Profil
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

