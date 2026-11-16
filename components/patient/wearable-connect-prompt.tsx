"use client"

import { useState } from "react"
import { Loader2, Watch } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/features/auth/store"
import { useWearableStore } from "@/features/wearable/store"

type WearableConnectPromptProps = {
  patientId: string
}

export function WearableConnectPrompt({ patientId }: WearableConnectPromptProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deviceId, setDeviceId] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const patientSession = useAuthStore((state) => state.patient)
  const connectWearable = useWearableStore((state) => state.connectWearable)

  async function handleConnect(): Promise<void> {
    const rawId = deviceId.trim().toLowerCase()
    if (!rawId) {
      toast.error("Masukkan ID terlebih dahulu")
      return
    }

    setIsConnecting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await connectWearable(patientId, rawId, patientSession?.token)
      toast.success("Smartwatch berhasil terhubung")
      setIsDialogOpen(false)
      setDeviceId("")
    } catch {
      toast.error("Gagal menghubungkan smartwatch")
    } finally {
      setIsConnecting(false)
    }
  }

  function handleOpenChange(open: boolean): void {
    setIsDialogOpen(open)
    if (!open) {
      setDeviceId("")
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted px-5 py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-card text-primary shadow-xs">
          <Watch className="size-7" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h3 className="type-heading">Smartwatch belum terhubung</h3>
          <p className="mx-auto max-w-sm type-caption">
            Hubungkan smartwatch kamu untuk memantau langkah, detak jantung, tidur, dan SpO₂.
          </p>
        </div>

        <Button type="button" onClick={() => setIsDialogOpen(true)}>
          Hubungkan smartwatch
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hubungkan Smartwatch</DialogTitle>
            <DialogDescription>
              Masukkan ID smartwatch untuk menghubungkan perangkat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="device-id">ID Smartwatch</Label>
              <Input
                id="device-id"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="Masukkan ID"
                disabled={isConnecting}
                className="font-mono text-base uppercase sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isConnecting}
            >
              Batal
            </Button>
            <Button type="button" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Menghubungkan...
                </>
              ) : (
                "Hubungkan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
