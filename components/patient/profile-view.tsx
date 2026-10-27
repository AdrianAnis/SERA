"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ActivitySection } from "@/components/patient/activity-section"
import { PageSkeleton } from "@/components/patient/page-skeleton"
import { ProfileAccountPanel } from "@/components/patient/profile-account-panel"
import { ProfileHistoryPanel } from "@/components/patient/profile-history-panel"
import { DEFAULT_PROFILE_SECTION, PROFILE_SECTIONS, type ProfileSectionValue } from "@/components/patient/profile-sections"
import { ProfileSidebar } from "@/components/patient/profile-sidebar"
import { selectPlanHistory } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import { selectDoctorById } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import { usePatientActions } from "@/features/patient/use-patient-actions"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { useNow } from "@/lib/use-now"

function resolveSection(requested: string | null): ProfileSectionValue {
  return PROFILE_SECTIONS.find((section) => section.value === requested)?.value ?? DEFAULT_PROFILE_SECTION
}

export function ProfileView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isHydrated, patient } = usePatientContext()
  const doctors = usePatientStore((state) => state.doctors)
  const plans = useCarePlanStore((state) => state.plans)
  const { logout } = usePatientActions()
  const now = useNow()

  if (!isHydrated || !patient) return <PageSkeleton />

  const activeSection = resolveSection(searchParams.get("tab"))
  const activeLabel = PROFILE_SECTIONS.find((section) => section.value === activeSection)?.label
  const doctor = selectDoctorById(doctors, patient.assignedDoctorId)

  function handleSelect(section: ProfileSectionValue): void {
    router.replace(`${pathname}?tab=${section}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <h1 className="type-title">Profil</h1>

      <div className="grid gap-6 md:grid-cols-3 md:items-start">
        <ProfileSidebar patient={patient} activeSection={activeSection} onSelect={handleSelect} onLogout={logout} />

        <section className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm md:col-span-2 md:p-8">
          <h2 className="mb-6 border-b pb-4 type-heading">{activeLabel}</h2>
          {activeSection === "data" ? <ProfileAccountPanel patient={patient} doctor={doctor} now={now} /> : null}
          {activeSection === "aktivitas" ? <ActivitySection patientId={patient.id} /> : null}
          {activeSection === "riwayat" ? <ProfileHistoryPanel plans={selectPlanHistory(plans, patient.id)} /> : null}
        </section>
      </div>
    </div>
  )
}
