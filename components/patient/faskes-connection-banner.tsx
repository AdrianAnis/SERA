"use client"

import { useState, useEffect } from "react"
import { Building2, Check, X, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store"
import { connectionApi, type FaskesLinkRequest } from "@/lib/api"

export function FaskesConnectionBanner() {
  const patientSession = useAuthStore((state) => state.patient)
  const [requests, setRequests] = useState<FaskesLinkRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function loadPendingRequests() {
    if (!patientSession?.token) return
    try {
      const data = await connectionApi.getPendingRequests(patientSession.token)
      setRequests(data || [])
    } catch (err) {
      // If error or unauthenticated, ignore silently
      console.error("[FaskesConnectionBanner] Failed to fetch link requests:", err)
    }
  }

  useEffect(() => {
    loadPendingRequests()
  }, [patientSession?.token])

  async function handleApprove(requestId: string) {
    if (!patientSession?.token) return
    setActiveActionId(requestId)
    try {
      const res = await connectionApi.approveLinkRequest(requestId, patientSession.token)
      setSuccessMessage(
        `Berhasil terhubung dengan ${res.doctorName || "dokter"} (${res.hospitalName || "Fasilitas Kesehatan"}). Rekam medis Anda telah tertaut!`
      )
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    } catch (err) {
      console.error("[FaskesConnectionBanner] Failed to approve link request:", err)
    } finally {
      setActiveActionId(null)
    }
  }

  async function handleReject(requestId: string) {
    if (!patientSession?.token) return
    setActiveActionId(requestId)
    try {
      await connectionApi.rejectLinkRequest(requestId, patientSession.token)
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    } catch (err) {
      console.error("[FaskesConnectionBanner] Failed to reject link request:", err)
    } finally {
      setActiveActionId(null)
    }
  }

  if (successMessage) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-4 text-emerald-900 shadow-sm animate-in fade-in">
        <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
        <p className="flex-1 text-sm font-medium">{successMessage}</p>
        <Button
          size="sm"
          variant="ghost"
          className="size-8 p-0 text-emerald-700 hover:bg-emerald-100 rounded-full"
          onClick={() => setSuccessMessage(null)}
        >
          <X className="size-4" />
        </Button>
      </div>
    )
  }

  if (requests.length === 0) return null

  const activeRequest = requests[0]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-foreground shadow-sm animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Permintaan Faskes
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-sm">
            {activeRequest.hospitalName || "Fasilitas Kesehatan"}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activeRequest.doctorName ? `${activeRequest.doctorName} · ` : ""}
            Ingin menghubungkan akun ini dengan Rekam Medis (MRN: {activeRequest.patientMrn || "Tersedia"}) agar Care Plan dapat disinkronkan langsung ke perangkat Anda.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
        <Button
          size="sm"
          variant="ghost"
          disabled={activeActionId !== null}
          onClick={() => handleReject(activeRequest.id)}
          className="h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          {activeActionId === activeRequest.id ? <Loader2 className="size-3.5 animate-spin" /> : <X className="mr-1 size-3.5" />}
          Tolak
        </Button>
        <Button
          size="sm"
          disabled={activeActionId !== null}
          onClick={() => handleApprove(activeRequest.id)}
          className="h-8 rounded-full px-4 text-xs font-semibold shadow-sm"
        >
          {activeActionId === activeRequest.id ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Check className="mr-1.5 size-3.5" />
          )}
          Setujui Penghubungan
        </Button>
      </div>
    </div>
  )
}

