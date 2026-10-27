import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ATTENTION_KIND_LABEL, type AttentionItem, type AttentionKind } from "@/features/dashboard/selectors"
import { formatDateTime } from "@/lib/date"
import { routes } from "@/lib/routes"
import { cn, getInitials } from "@/lib/utils"

type DashboardAttentionCardProps = {
  items: AttentionItem[]
  patientNames: Record<string, string>
}

const KIND_DOT_CLASS: Record<AttentionKind, string> = {
  feedback: "bg-primary",
  escalation: "bg-destructive",
}

export function DashboardAttentionCard({ items, patientNames }: DashboardAttentionCardProps) {
  return (
    <section className="rounded-2xl border bg-card">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">Perlu ditinjau</h2>
        <p className="type-caption">Laporan pasien dan eskalasi yang menunggu Anda.</p>
      </header>
      {items.length === 0 ? (
        <p className="p-8 text-center type-caption">Semua sudah ditinjau.</p>
      ) : (
        <ul className="divide-y">
          {items.map((item) => {
            const name = patientNames[item.patientId] ?? item.patientId
            return (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="truncate type-caption">{item.detail}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={cn("size-1.5 rounded-full", KIND_DOT_CLASS[item.kind])} />
                    {ATTENTION_KIND_LABEL[item.kind]} · {formatDateTime(item.occurredAt)}
                  </p>
                </div>
                <Link href={routes.hospital.monitoring(item.patientId)} className="shrink-0 text-sm font-medium text-primary hover:underline">
                  Tinjau
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
