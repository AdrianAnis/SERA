"use client"

import { useEffect, useState } from "react"
import { Clock, Loader2, RefreshCw, Watch } from "lucide-react"
import { toast } from "sonner"

import { WearableConnectPrompt } from "@/components/patient/wearable-connect-prompt"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { WearableMetricCard } from "@/components/wearable-metric-card"
import { useAuthStore } from "@/features/auth/store"
import { WEARABLE_METRICS } from "@/features/wearable/schema"
import { selectConnection } from "@/features/wearable/selectors"
import { useWearableStore } from "@/features/wearable/store"
import { selectMetricTrend } from "@/features/wearable/trend-selectors"
import { cn } from "@/lib/utils"
import { formatDateTime, toDateKey } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"

type WearableOverviewProps = {
  patientId: string
}

export function WearableOverview({ patientId }: WearableOverviewProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const patientSession = useAuthStore((state) => state.patient)
  const connections = useWearableStore((state) => state.connections)
  const trends = useWearableStore((state) => state.trends)
  const fetchStatus = useWearableStore((state) => state.fetchStatus)
  const fetchTrends = useWearableStore((state) => state.fetchTrends)
  const syncWearable = useWearableStore((state) => state.syncWearable)
  const disconnectWearable = useWearableStore((state) => state.disconnectWearable)
  const now = useNow()
  const connection = selectConnection(connections, patientId)

  useEffect(() => {
    if (patientSession?.token) {
      void fetchStatus(patientId, patientSession.token)
      void fetchTrends(patientId, "day", toDateKey(now), patientSession.token)
    }
  }, [patientId, patientSession?.token, fetchStatus, fetchTrends, now])

  async function handleConfirmDisconnect(): Promise<void> {
    setIsDisconnecting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await disconnectWearable(patientId, patientSession?.token)
      toast.success("Smartwatch berhasil diputuskan")
      setIsDisconnectModalOpen(false)
    } catch {
      toast.error("Gagal memutuskan smartwatch")
    } finally {
      setIsDisconnecting(false)
    }
  }

  async function handleSync(): Promise<void> {
    setIsSyncing(true)
    try {
      if (patientSession?.token) {
        await syncWearable(patientId, patientSession.token)
        toast.success("Data berhasil disinkronkan")
      }
    } catch {
      toast.error("Gagal menyinkronkan data")
    } finally {
      setIsSyncing(false)
    }
  }

  const patientTrends = trends[patientId]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="type-subheading">Data smartwatch</h3>
        <p className="type-caption">Langkah, detak jantung, tidur, dan saturasi oksigen kamu.</p>
      </div>

      {connection ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {WEARABLE_METRICS.map((metric) => {
              const trend = patientTrends?.[metric] ?? selectMetricTrend(patientId, metric, "day", toDateKey(now), now)
              return (
                <WearableMetricCard
                  key={metric}
                  href={routes.patient.activityMetric(metric)}
                  metric={metric}
                  trend={trend}
                />
              )
            })}
          </div>

          {/* Banner Status & Log Jam Smartwatch */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Watch className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{connection.deviceName}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Terhubung
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    Terakhir sinkron: {connection.lastSyncAt ? formatDateTime(connection.lastSyncAt) : formatDateTime(now)}
                  </span>
                  <span>·</span>
                  <span>Terhubung sejak: {formatDateTime(connection.connectedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={cn("mr-1.5 size-3.5", isSyncing && "animate-spin")} />
                Sinkronkan
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsDisconnectModalOpen(true)}
              >
                Putuskan
              </Button>
            </div>
          </div>

          {/* Pop up Konfirmasi Disconnect dengan Log Perangkat */}
          <Dialog open={isDisconnectModalOpen} onOpenChange={setIsDisconnectModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Putuskan sambungan smartwatch?</DialogTitle>
                <DialogDescription>
                  Apakah kamu yakin ingin memutuskan sambungan smartwatch ini?
                </DialogDescription>
              </DialogHeader>

              {/* Box Log Jam & Status Perangkat */}
              <div className="rounded-xl border bg-muted/40 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Watch className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{connection.deviceName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">● Terhubung</span>
                </div>
                <div className="border-t pt-2 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  <div>
                    <span className="block text-[10px] text-muted-foreground/75">Waktu Hubung</span>
                    <span className="font-medium text-foreground">{formatDateTime(connection.connectedAt)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground/75">Terakhir Sinkron</span>
                    <span className="font-medium text-foreground">
                      {connection.lastSyncAt ? formatDateTime(connection.lastSyncAt) : formatDateTime(now)}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDisconnectModalOpen(false)}
                  disabled={isDisconnecting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDisconnect}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Memutuskan...
                    </>
                  ) : (
                    "Putuskan"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <WearableConnectPrompt patientId={patientId} />
      )}
    </div>
  )
}
