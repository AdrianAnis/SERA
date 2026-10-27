import Link from "next/link"

import { formatDate } from "@/lib/date"
import { routes } from "@/lib/routes"

export type FollowUpRow = {
  patientId: string
  name: string
  date: string
  instruction: string
}

type DashboardFollowUpsCardProps = {
  rows: FollowUpRow[]
}

export function DashboardFollowUpsCard({ rows }: DashboardFollowUpsCardProps) {
  return (
    <section className="rounded-2xl border bg-card">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">Kontrol terdekat</h2>
        <p className="type-caption">Dari care plan aktif.</p>
      </header>
      {rows.length === 0 ? (
        <p className="p-8 text-center type-caption">Belum ada jadwal kontrol.</p>
      ) : (
        <ul className="divide-y">
          {rows.map((row) => (
            <li key={row.patientId} className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-xs leading-none font-medium uppercase">{formatDate(row.date, "MMM")}</span>
                <span className="mt-0.5 text-lg leading-none font-semibold">{formatDate(row.date, "d")}</span>
              </div>
              <div className="min-w-0">
                <Link href={routes.hospital.patientDetail(row.patientId)} className="text-sm font-medium hover:text-primary">
                  {row.name}
                </Link>
                <p className="truncate type-caption">{row.instruction}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
