"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { CarePlanBuilder } from "@/components/hospital/care-plan-builder"
import { HospitalPageSkeleton } from "@/components/hospital/hospital-page-skeleton"
import { PageHeader } from "@/components/hospital/page-header"
import { Button } from "@/components/ui/button"
import { useDoctorContext } from "@/features/auth/use-doctor-context"
import { usePatientRecord } from "@/features/patient/use-patient-record"
import { routes } from "@/lib/routes"

type CarePlanBuilderViewProps = {
  patientId: string
}

export function CarePlanBuilderView({ patientId }: CarePlanBuilderViewProps) {
  const { isHydrated, patient, activePlan, planHistory } = usePatientRecord(patientId)
  const { doctor } = useDoctorContext()

  if (!isHydrated) return <HospitalPageSkeleton />

  if (!patient || !doctor) {
    return <PageHeader title="Patient not found" description="The builder cannot be opened without patient data." />
  }

  const nextVersion = (planHistory[0]?.version ?? 0) + 1
  const title = activePlan ? "Revise care plan" : "New care plan"

  return (
    <>
      <PageHeader
        title={title}
        description={`${patient.name} · ${patient.mrn}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={routes.hospital.patientDetail(patient.id)}>
              <ChevronLeft />
              Back to patient
            </Link>
          </Button>
        }
      />
      <CarePlanBuilder patient={patient} doctor={doctor} activePlan={activePlan} nextVersion={nextVersion} />
    </>
  )
}
