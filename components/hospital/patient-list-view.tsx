"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"

import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { PlanStatusLabel } from "@/components/hospital/plan-status-label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PATIENT_PLAN_STATUS_LABEL } from "@/features/care-plan/labels"
import { selectPatientPlanStatus, selectPatientPlans, type PatientPlanStatus } from "@/features/care-plan/selectors"
import { useCarePlanStore } from "@/features/care-plan/store"
import { useFeedbackStore } from "@/features/feedback/store"
import { selectPatientAge } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import { selectAdherenceByDay, selectAdherenceRatio } from "@/features/reminder/selectors"
import { routes } from "@/lib/routes"
import { useHydrated } from "@/lib/use-hydrated"
import { useNow } from "@/lib/use-now"
import { getInitials } from "@/lib/utils"

type StatusFilter = PatientPlanStatus | "all"

const FILTER_OPTIONS = Object.entries(PATIENT_PLAN_STATUS_LABEL) as [PatientPlanStatus, string][]

function isStatusFilter(value: string): value is StatusFilter {
  return value === "all" || value in PATIENT_PLAN_STATUS_LABEL
}

export function PatientListView() {
  const isHydrated = useHydrated()
  const patients = usePatientStore((state) => state.patients)
  const plans = useCarePlanStore((state) => state.plans)
  const completions = useFeedbackStore((state) => state.completions)
  const now = useNow()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  if (!isHydrated) return <HospitalPageSkeleton />

  const normalizedQuery = query.trim().toLowerCase()
  const visiblePatients = patients.filter((patient) => {
    const matchesQuery = patient.name.toLowerCase().includes(normalizedQuery) || patient.mrn.toLowerCase().includes(normalizedQuery)
    const matchesStatus = statusFilter === "all" || selectPatientPlanStatus(plans, patient.id) === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <>
      <PageHeader title="Pasien" description={`${patients.length} pasien yang Anda tangani.`} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Label htmlFor="patient-search" className="sr-only">
              Cari pasien
            </Label>
            <Search className="absolute top-3 left-3.5 size-4 text-muted-foreground" />
            <Input
              id="patient-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau nomor rekam medis"
              className="bg-card pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(isStatusFilter(value) ? value : "all")}>
            <SelectTrigger aria-label="Filter status care plan" className="w-full bg-card sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              {FILTER_OPTIONS.map(([status, label]) => (
                <SelectItem key={status} value={status}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border bg-card">
          <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs font-medium text-muted-foreground md:grid">
            <span className="col-span-4">Pasien</span>
            <span className="col-span-3">Diagnosis</span>
            <span className="col-span-2">Care plan</span>
            <span className="col-span-3">Tingkat Kepatuhan (7 hari)</span>
          </div>
          {visiblePatients.length === 0 ? (
            <p className="p-10 text-center type-caption">Tidak ada pasien yang cocok.</p>
          ) : (
            <ul className="divide-y">
              {visiblePatients.map((patient) => {
                const ratio = selectAdherenceRatio(selectAdherenceByDay(selectPatientPlans(plans, patient.id), completions, now))
                const percentage = ratio === null ? 0 : Math.round(ratio * 100)
                return (
                  <li key={patient.id}>
                    <Link
                      href={routes.hospital.patientDetail(patient.id)}
                      className="grid items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 md:grid-cols-12 md:gap-4"
                    >
                      <div className="flex items-center gap-3 md:col-span-4">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{getInitials(patient.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{patient.name}</p>
                          <p className="type-caption">
                            {patient.mrn} · {selectPatientAge(patient, now)} th
                          </p>
                        </div>
                      </div>
                      <p className="text-sm md:col-span-3">{patient.primaryDiagnosis}</p>
                      <div className="md:col-span-2">
                        <PlanStatusLabel status={selectPatientPlanStatus(plans, patient.id)} />
                      </div>
                      <div className="flex items-center gap-3 md:col-span-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">{ratio === null ? "-" : `${percentage}%`}</span>
                        <ChevronRight className="hidden size-4 text-muted-foreground md:block" aria-hidden="true" />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
