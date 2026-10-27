"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { AdherenceLineChart } from "@/components/adherence-line-chart"
import { AdherenceTrendSummaryCards } from "@/components/adherence-trend-summary"
import { ConversationSummaryCard } from "@/components/hospital/conversation-summary-card"
import { WearableSection } from "@/components/hospital/wearable-section"
import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { StatusDot } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { FEEDBACK_CATEGORY_LABEL, FEEDBACK_STATUS_LABEL } from "@/features/feedback/labels"
import { selectPatientFeedback } from "@/features/feedback/selectors"
import { useFeedbackStore } from "@/features/feedback/store"
import { selectConversationSummary, selectThread } from "@/features/companion/selectors"
import { useCompanionStore } from "@/features/companion/store"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { selectAdherenceByDay, selectAdherenceRatio, selectAdherenceTrend, selectAdherenceTrendSummary } from "@/features/reminder/selectors"
import { formatDateTime } from "@/lib/date"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"

type MonitoringViewProps = {
  patientId: string
}

export function MonitoringView({ patientId }: MonitoringViewProps) {
  const { isHydrated, patient, activePlan, planHistory } = usePatientRecord(patientId)
  const completions = useFeedbackStore((state) => state.completions)
  const entries = useFeedbackStore((state) => state.entries)
  const resolveFeedback = useFeedbackStore((state) => state.resolveFeedback)
  const threads = useCompanionStore((state) => state.threads)
  const now = useNow()

  if (!isHydrated) return <HospitalPageSkeleton />

  const days = selectAdherenceByDay(planHistory, completions, now)
  const ratio = selectAdherenceRatio(days)
  const trend = selectAdherenceTrend(planHistory, completions, now)
  const feedback = selectPatientFeedback(entries, patientId)
  const thread = selectThread(threads, patientId)
  const conversationSummary = selectConversationSummary(thread, activePlan)

  return (
    <>
      <PageHeader
        title="Monitoring"
        description={patient ? `Perilaku dan laporan ${patient.name}.` : "Pasien tidak ditemukan."}
        actions={
          <Button asChild variant="outline">
            <Link href={routes.hospital.patientDetail(patientId)}>
              <ChevronLeft />
              Kembali ke pasien
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 p-4 md:p-6 xl:grid-cols-3">
        <section className="space-y-4 self-start rounded-2xl border bg-card p-5 xl:col-span-2">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="type-subheading">Tingkat Kepatuhan Pasien</h2>
              <p className="type-caption">7 hari terakhir. Data perilaku, bukan indikator kesembuhan.</p>
            </div>
            <span className="text-3xl leading-none font-semibold tabular-nums">{ratio === null ? "-" : `${Math.round(ratio * 100)}%`}</span>
          </header>
          <AdherenceLineChart points={trend} />
          <AdherenceTrendSummaryCards summary={selectAdherenceTrendSummary(trend)} />
        </section>

        <ConversationSummaryCard patientName={patient?.name ?? "Pasien"} summary={conversationSummary} />

        <WearableSection patientId={patientId} patientName={patient?.name ?? "Pasien"} />

        <section className="rounded-2xl border bg-card xl:col-span-3">
          <header className="border-b px-5 py-4">
            <h2 className="type-subheading">Laporan pasien</h2>
            <p className="type-caption">Keluhan dan kendala yang dikirim pasien.</p>
          </header>
          {feedback.length === 0 ? (
            <p className="p-8 text-center type-caption">Belum ada laporan dari pasien.</p>
          ) : (
            <ul className="divide-y">
              {feedback.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="type-overline">
                      {FEEDBACK_CATEGORY_LABEL[entry.category]} · {formatDateTime(entry.createdAt)}
                    </p>
                    <p className="text-sm">{entry.message}</p>
                    <StatusDot tone={entry.status === "open" ? "warning" : "success"} label={FEEDBACK_STATUS_LABEL[entry.status]} />
                  </div>
                  {entry.status === "open" ? (
                    <Button variant="outline" onClick={() => resolveFeedback(entry.id)}>
                      Tandai sudah ditinjau
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
