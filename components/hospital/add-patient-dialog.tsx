"use client"

import { useState } from "react"

import Link from "next/link"
import { AlertCircle, FilePenLine, Loader2, Search, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { selectPatientAge } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import type { Patient } from "@/features/patient/types"
import { ApiError } from "@/lib/api"
import { routes } from "@/lib/routes"
import { useNow } from "@/lib/use-now"
import { getInitials } from "@/lib/utils"

type SearchState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "found"; patient: Patient }
  | { status: "not-found"; mrn: string }
  | { status: "error"; message: string }

export function AddPatientDialog() {
  const findPatientByMrn = usePatientStore((state) => state.findPatientByMrn)
  const now = useNow()
  const [isOpen, setIsOpen] = useState(false)
  const [mrn, setMrn] = useState("")
  const [search, setSearch] = useState<SearchState>({ status: "idle" })

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen)
    if (!nextOpen) {
      setMrn("")
      setSearch({ status: "idle" })
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMrn = mrn.trim()
    if (!trimmedMrn) return
    setSearch({ status: "searching" })
    try {
      const patient = await findPatientByMrn(trimmedMrn)
      setSearch(patient ? { status: "found", patient } : { status: "not-found", mrn: trimmedMrn })
    } catch (err) {
      const message = err instanceof ApiError ? err.userMessage : "Failed to check the medical record number. Please try again."
      setSearch({ status: "error", message })
    }
  }

  const isSearching = search.status === "searching"
  const foundPatient = search.status === "found" ? search.patient : null
  const age = foundPatient ? selectPatientAge(foundPatient, now) : null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Add patient
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>Enter the medical record number (MRN) from the hospital system to find the patient.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="add-patient-mrn">Medical record number</Label>
          <div className="flex gap-2">
            <Input
              id="add-patient-mrn"
              value={mrn}
              autoFocus
              autoComplete="off"
              placeholder="Example: RM-2024-00187"
              onChange={(event) => {
                setMrn(event.target.value)
                if (search.status !== "idle" && search.status !== "searching") setSearch({ status: "idle" })
              }}
            />
            <Button type="submit" variant="outline" disabled={isSearching || !mrn.trim()} className="shrink-0 gap-2">
              {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              Find
            </Button>
          </div>
        </form>

        {search.status === "not-found" ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>No patient found with MRN {search.mrn}. Check the number and try again.</span>
          </div>
        ) : null}

        {search.status === "error" ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{search.message}</span>
          </div>
        ) : null}

        {foundPatient ? (
          <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{getInitials(foundPatient.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{foundPatient.name}</p>
                <p className="type-caption">
                  {foundPatient.mrn}
                  {age !== null ? ` · ${age} years` : ""}
                  {foundPatient.gender ? ` · ${foundPatient.gender === "male" ? "Male" : "Female"}` : ""}
                </p>
              </div>
            </div>
            {foundPatient.primaryDiagnosis ? (
              <p className="text-sm">
                <span className="text-muted-foreground">Diagnosis: </span>
                {foundPatient.primaryDiagnosis}
              </p>
            ) : null}
          </div>
        ) : null}

        {foundPatient ? (
          <DialogFooter>
            <Button asChild variant="outline">
              <Link href={routes.hospital.patientDetail(foundPatient.id)}>View patient</Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href={routes.hospital.carePlanNew(foundPatient.id)}>
                <FilePenLine className="size-4" />
                Create care plan
              </Link>
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
