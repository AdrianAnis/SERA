import { ConsultationRow } from "@/components/hospital/consultation-row"
import type { Consultation } from "@/features/consultation/types"
import { daysBetween, formatDate } from "@/lib/date"

type ConsultationDayPanelProps = {
  dateKey: string
  now: Date
  consultations: Consultation[]
  patientNames: Record<string, string>
  reconfirmationIds: string[]
  onCancel: (consultation: Consultation) => void
  onReconfirm: (consultation: Consultation) => void
}

function describeDay(dateKey: string, now: Date): string {
  const dayOffset = daysBetween(now, dateKey)
  const dateLabel = formatDate(dateKey, "EEEE, d MMMM yyyy")
  if (dayOffset === 0) return `Hari ini · ${dateLabel}`
  if (dayOffset === 1) return `Besok · ${dateLabel}`
  return dateLabel
}

export function ConsultationDayPanel({ dateKey, now, consultations, patientNames, reconfirmationIds, onCancel, onReconfirm }: ConsultationDayPanelProps) {
  return (
    <section className="rounded-2xl border bg-card">
      <header className="border-b px-5 py-4">
        <h2 className="type-subheading">{describeDay(dateKey, now)}</h2>
        <p className="type-caption">{consultations.length} konsultasi pada hari ini.</p>
      </header>
      {consultations.length === 0 ? (
        <p className="p-8 text-center type-caption">Tidak ada konsultasi pada tanggal ini.</p>
      ) : (
        <ul className="divide-y">
          {consultations.map((consultation) => (
            <ConsultationRow
              key={consultation.id}
              consultation={consultation}
              patientName={patientNames[consultation.patientId] ?? consultation.patientId}
              needsReconfirmation={reconfirmationIds.includes(consultation.id)}
              onCancel={onCancel}
              onReconfirm={onReconfirm}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
