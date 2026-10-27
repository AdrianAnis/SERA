"use client"

import { Watch } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWearableStore } from "@/features/wearable/store"

type WearableConnectPromptProps = {
  patientId: string
}

export function WearableConnectPrompt({ patientId }: WearableConnectPromptProps) {
  const connectWearable = useWearableStore((state) => state.connectWearable)

  function handleConnect(): void {
    connectWearable(patientId)
    toast.success("Smartwatch terhubung")
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted px-5 py-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-card text-primary">
        <Watch className="size-7" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="type-heading">Smartwatch belum terhubung</h3>
        <p className="mx-auto max-w-sm type-caption">Hubungkan smartwatch agar langkah, detak jantung, tidur, dan SpO₂ kamu tercatat dan bisa dilihat dokter.</p>
      </div>
      <Button type="button" onClick={handleConnect}>
        Hubungkan smartwatch
      </Button>
    </div>
  )
}
