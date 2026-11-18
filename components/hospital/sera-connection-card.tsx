"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Clock, Link2, Send, Copy, Check, UserCheck, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  connectionApi,
  type SeraStatusResponse,
  type PatientSeraStatus,
} from "@/lib/api"

type SeraConnectionCardProps = {
  patientId: string
  patientName: string
  phone: string
}

export function SeraConnectionCard({ patientId, patientName, phone }: SeraConnectionCardProps) {
  const [data, setData] = useState<SeraStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  async function fetchStatus() {
    try {
      setIsLoading(true)
      const res = await connectionApi.getSeraStatus(patientId)
      setData(res)
    } catch (err) {
      console.error("[SeraConnectionCard] Failed to fetch SERA status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [patientId])

  async function handleRequestLink() {
    setIsActionLoading(true)
    setActionMessage(null)
    try {
      await connectionApi.requestLink(patientId)
      setActionMessage({
        type: "success",
        text: "Permintaan penghubungan berhasil dikirim ke aplikasi pasien.",
      })
      await fetchStatus()
    } catch (err) {
      setActionMessage({
        type: "error",
        text: (err as Error).message || "Gagal mengirim permintaan penghubungan.",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleInvite() {
    setIsActionLoading(true)
    setActionMessage(null)
    try {
      await connectionApi.invitePatient(patientId)
      setActionMessage({
        type: "success",
        text: "Undangan aktivasi akun SERA berhasil dibuat.",
      })
      await fetchStatus()
    } catch (err) {
      setActionMessage({
        type: "error",
        text: (err as Error).message || "Gagal membuat undangan aktivasi.",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  function handleCopyActivation(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <h2 className="type-subheading">Koneksi Aplikasi SERA</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Memeriksa status akun SERA...</span>
        </div>
      </section>
    )
  }

  const status = data?.status || "unregistered"

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="type-subheading">Koneksi Aplikasi SERA</h2>
        {status === "connected" && (
          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1.5 py-1">
            <CheckCircle2 className="size-3.5" />
            Terhubung
          </Badge>
        )}
        {status === "pending" && (
          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 gap-1.5 py-1">
            <Clock className="size-3.5" />
            Menunggu Persetujuan
          </Badge>
        )}
        {status === "unlinked_registered" && (
          <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 border-blue-500/30 gap-1.5 py-1">
            <UserCheck className="size-3.5" />
            Akun Ditemukan
          </Badge>
        )}
        {status === "unregistered" && (
          <Badge variant="outline" className="text-muted-foreground gap-1.5 py-1">
            <AlertCircle className="size-3.5" />
            Belum Terdaftar
          </Badge>
        )}
      </div>

      {actionMessage && (
        <div
          className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {status === "connected" && data?.user && (
        <div className="rounded-xl border bg-muted/40 p-3.5 text-sm space-y-1.5">
          <p className="font-medium text-foreground">{data.user.name}</p>
          <p className="text-muted-foreground text-xs">{data.user.email} · {data.user.phone || phone}</p>
          <p className="text-xs text-emerald-700 font-medium pt-1">
            ✓ Pasien dapat menerima sinkronisasi Care Plan dan notifikasi langsung di aplikasi SERA.
          </p>
        </div>
      )}

      {status === "pending" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-900 space-y-2">
          <p className="font-medium">Permintaan sedang menunggu konfirmasi pasien</p>
          <p className="text-muted-foreground">
            Notifikasi telah dikirim ke perangkat pasien. Care Plan akan tersinkronisasi otomatis begitu pasien menyetujui.
          </p>
        </div>
      )}

      {status === "unlinked_registered" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Nomor HP ({phone}) cocok dengan akun pengguna SERA terdaftar ({data?.user?.email}).
          </p>
          <Button
            size="sm"
            onClick={handleRequestLink}
            disabled={isActionLoading}
            className="w-full gap-2 rounded-xl"
          >
            {isActionLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Kirim Permintaan Penghubungan
          </Button>
        </div>
      )}

      {status === "unregistered" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Pasien belum mendaftar di SERA Patient App. Kirim undangan aktivasi agar pasien dapat mengunduh dan menghubungkan rekam medisnya.
          </p>

          {data?.latestInvitation ? (
            <div className="rounded-xl border bg-muted/30 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Link Aktivasi Terakhir:</span>
                <span className="text-[11px]">Aktif s/d {new Date(data.latestInvitation.expiresAt).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={data.latestInvitation.activationUrl || `https://app.sera-health.com/activate?token=${data.latestInvitation.token}`}
                  className="flex-1 bg-background border rounded-lg px-2.5 py-1 text-xs truncate focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="size-8 p-0 shrink-0 rounded-lg"
                  onClick={() =>
                    handleCopyActivation(
                      data.latestInvitation?.activationUrl ||
                        `https://app.sera-health.com/activate?token=${data.latestInvitation?.token}`
                    )
                  }
                >
                  {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleInvite}
              disabled={isActionLoading}
              className="w-full gap-2 rounded-xl"
            >
              {isActionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Buat Undangan Aktivasi
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

