"use client"

import { AdherenceLineChart } from "@/components/adherence-line-chart"
import { AdherenceTrendSummaryCards } from "@/components/adherence-trend-summary"
import { FeedbackForm } from "@/components/patient/feedback-form"
import { WearableOverview } from "@/components/patient/wearable-overview"
import { Badge } from "@/components/ui/badge"
import { selectPatientPlans } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import { FEEDBACK_CATEGORY_LABEL, FEEDBACK_STATUS_LABEL } from "@/features/feedback/labels"
import { selectPatientFeedback } from "@/features/feedback/selectors"
import { useFeedbackStore } from "@/features/feedback/store"
import { selectAdherenceTrend, selectAdherenceTrendSummary } from "@/features/reminder/selectors"
import { formatDate } from "@/lib/date"
import { useNow } from "@/lib/use-now"

type ActivitySectionProps = {
  patientId: string
}

export function ActivitySection({ patientId }: ActivitySectionProps) {
  const plans = useCarePlanStore((state) => state.plans)
  const completions = useFeedbackStore((state) => state.completions)
  const entries = useFeedbackStore((state) => state.entries)
  const addFeedback = useFeedbackStore((state) => state.addFeedback)
  const now = useNow()

  const trend = selectAdherenceTrend(selectPatientPlans(plans, patientId), completions, now)
  const feedback = selectPatientFeedback(entries, patientId)

  return (
    <section id="aktivitas" className="scroll-mt-24 space-y-6">
      <p className="type-caption">Kepatuhan, data smartwatch, dan laporan kamu ke dokter.</p>

      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="type-subheading">Tingkat kepatuhan</h3>
            <p className="type-caption">7 hari terakhir. Data perilaku, bukan indikator kesembuhan.</p>
          </div>
          <AdherenceLineChart points={trend} />
          <AdherenceTrendSummaryCards summary={selectAdherenceTrendSummary(trend)} />
        </div>

        <WearableOverview patientId={patientId} />

        <div id="lapor-keluhan" className="scroll-mt-24">
          <h3 className="mb-4 type-subheading">Lapor kendala atau keluhan</h3>
          <FeedbackForm onSubmit={(values) => addFeedback({ patientId, ...values })} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="type-subheading">Laporan saya</h3>
        {feedback.length === 0 ? (
          <p className="rounded-2xl bg-muted p-4 type-caption">Kamu belum mengirim laporan apa pun.</p>
        ) : (
          <ul className="space-y-3">
            {feedback.map((entry) => (
              <li key={entry.id} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{FEEDBACK_CATEGORY_LABEL[entry.category]}</Badge>
                  <Badge variant="outline">{FEEDBACK_STATUS_LABEL[entry.status]}</Badge>
                  <span className="type-caption">{formatDate(entry.createdAt, "d MMM yyyy")}</span>
                </div>
                <p className="mt-2">{entry.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
