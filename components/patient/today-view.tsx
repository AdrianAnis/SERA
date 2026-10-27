"use client"

import { Suspense } from "react"
import { DietGuideCard } from "@/components/patient/diet-guide-card"
import { CarePlanItemDialog } from "@/components/patient/care-plan-item-dialog"
import { EmptyState } from "@/components/patient/empty-state"
import { FollowUpCard } from "@/components/patient/follow-up-card"
import { AchievementsCard } from "@/components/patient/achievements-card"
import { NextReminderCard } from "@/components/patient/next-reminder-card"
import { PageSkeleton } from "@/components/patient/page-skeleton"
import { ReportPromptLink } from "@/components/patient/report-prompt-link"
import { PlanUpdateBanner } from "@/components/patient/plan-update-banner"
import { ReminderTimeline } from "@/components/patient/reminder-timeline"
import { ScheduleProgress } from "@/components/patient/schedule-progress"
import { TodayHeader } from "@/components/patient/today-header"
import { selectItemsByKind, selectNextFollowUp, selectPatientPlans } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import { useFeedbackStore } from "@/features/feedback/store"
import { selectAchievements, selectCompleteDayStreak } from "@/features/mascot/selectors"
import { selectFirstName, selectHonorific } from "@/features/patient/selectors"
import { usePatientContext } from "@/features/patient/use-patient-context"
import {
  getTodayReminders,
  selectDailyProgress,
  selectNextReminder,
  selectAdherenceByDay,
  selectReminderViews,
} from "@/features/reminder/selectors"
import { toDateKey } from "@/lib/date"
import { useNow } from "@/lib/use-now"

export function TodayView() {
  const { isHydrated, patient, activePlan, activeDoctor } = usePatientContext()
  const plans = useCarePlanStore((state) => state.plans)
  const completions = useFeedbackStore((state) => state.completions)
  const toggleCompletion = useFeedbackStore((state) => state.toggleCompletion)
  const now = useNow()

  if (!isHydrated || !patient) return <PageSkeleton />

  const reminders = selectReminderViews(getTodayReminders(activePlan, now), completions, now)
  const progress = selectDailyProgress(reminders)
  const adherenceDays = selectAdherenceByDay(selectPatientPlans(plans, patient.id), completions, now)

  return (
    <div className="space-y-6">
      <TodayHeader
        now={now}
        honorific={selectHonorific(patient)}
        firstName={selectFirstName(patient)}
      />
      <PlanUpdateBanner />
      {activePlan ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7 xl:col-span-8">
            <NextReminderCard
              reminder={selectNextReminder(reminders)}
              total={reminders.length}
              onToggle={toggleCompletion}
            />
            <section className="space-y-3">
              <h2 className="type-heading">Jadwal hari ini</h2>
              <ScheduleProgress done={progress.done} total={progress.total} />
              <ReminderTimeline reminders={reminders} onToggle={toggleCompletion} />
            </section>
          </div>
          <aside className="min-w-0 space-y-6 lg:col-span-5 xl:col-span-4">
            <AchievementsCard streak={selectCompleteDayStreak(adherenceDays)} achievements={selectAchievements(adherenceDays)} />
            <DietGuideCard items={selectItemsByKind(activePlan, "diet")} />
            <FollowUpCard followUp={selectNextFollowUp(activePlan, toDateKey(now))} doctor={activeDoctor} now={now} />
            <ReportPromptLink />
          </aside>
        </div>
      ) : (
        <EmptyState
          title="Belum ada care plan aktif"
          description="Jadwal obat dan aktivitas akan muncul di sini setelah dokter mengonfirmasi care plan kamu."
        />
      )}
      <Suspense fallback={null}>
        <CarePlanItemDialog />
      </Suspense>
    </div>
  )
}
