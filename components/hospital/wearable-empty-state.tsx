import { Watch } from "lucide-react"

type WearableEmptyStateProps = {
  patientName: string
}

export function WearableEmptyState({ patientName }: WearableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Watch className="size-7" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="type-heading">Smartwatch belum terhubung</h3>
        <p className="mx-auto max-w-md type-caption">
          {patientName} belum menghubungkan smartwatch di aplikasi Sera. Data langkah, detak jantung, tidur, dan SpO₂ akan tampil di sini setelah perangkat terhubung.
        </p>
      </div>
    </div>
  )
}
