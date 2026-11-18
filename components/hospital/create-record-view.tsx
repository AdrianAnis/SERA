"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Building2,
  Calendar,
  ChevronLeft,
  FileText,
  Loader2,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"

import { PageHeader } from "@/components/hospital/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/features/auth/store"
import { usePatientStore } from "@/features/patient/store"
import {
  consultationApi,
  type AcceptAndCreateRecordInput,
  type InitRecordResponse,
} from "@/lib/api"
import { routes } from "@/lib/routes"

type CreateRecordViewProps = {
  requestId: string
}

export function CreateRecordView({ requestId }: CreateRecordViewProps) {
  const router = useRouter()
  const doctorSession = useAuthStore((state) => state.doctor)
  const fetchPatients = usePatientStore((state) => state.fetchPatients)

  const [initData, setInitData] = useState<InitRecordResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form states
  const [mrn, setMrn] = useState("")
  const [name, setName] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [birthDate, setBirthDate] = useState("1995-01-01")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [guardianName, setGuardianName] = useState("")
  const [guardianPhone, setGuardianPhone] = useState("")
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("Evaluasi Konsultasi Baru")
  const [conditionsText, setConditionsText] = useState("")
  const [allergiesText, setAllergiesText] = useState("")

  useEffect(() => {
    let isMounted = true
    async function loadInitData() {
      try {
        setIsLoading(true)
        const data = await consultationApi.getInitRecord(requestId, doctorSession?.token)
        if (isMounted) {
          setInitData(data)
          setMrn(data.nextMrn)
          setName(data.user.name)
          setPhone(data.user.phone || "081234567890")
        }
      } catch (err) {
        console.error("Gagal memuat inisialisasi rekam medis:", err)
        if (isMounted) setErrorMessage((err as Error).message || "Failed to load request data.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (requestId) {
      void loadInitData()
    }

    return () => {
      isMounted = false
    }
  }, [requestId, doctorSession?.token])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("Patient name cannot be empty.")
      return
    }

    if (!birthDate) {
      setErrorMessage("Date of birth is required.")
      return
    }

    if (!phone.trim()) {
      setErrorMessage("Phone number is required.")
      return
    }

    setIsSaving(true)

    try {
      const payload: AcceptAndCreateRecordInput = {
        mrn,
        name: name.trim(),
        gender,
        birthDate,
        phone: phone.trim(),
        address: address.trim() || undefined,
        guardianName: guardianName.trim() || undefined,
        guardianPhone: guardianPhone.trim() || undefined,
        primaryDiagnosis: primaryDiagnosis.trim() || "Evaluasi Konsultasi Baru",
        conditions: conditionsText
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        allergies: allergiesText
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      }

      await consultationApi.acceptAndCreateRecord(requestId, payload, doctorSession?.token)

      // Refresh list pasien di Zustand store agar pasien baru langsung tampil
      await fetchPatients()

      // Redirect ke list pasien
      router.push(routes.hospital.patientList)
    } catch (err) {
      console.error("Gagal menyimpan rekam medis:", err)
      setErrorMessage((err as Error).message || "Failed to create the medical record.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Preparing an automatic medical record number...</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="New Medical Record Form"
        description={`Accept the request and issue a Medical Record for ${initData?.user.name || "Patient"}.`}
        actions={
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href={routes.hospital.requests}>
              <ChevronLeft className="mr-1 size-4" />
              Back to Requests
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
        {errorMessage ? (
          <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive shadow-sm animate-in fade-in">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Identitas & MRN */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="type-heading flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    Medical Record Identity
                  </CardTitle>
                  <CardDescription className="text-xs">
                    The Medical Record Number (MRN) is generated automatically by the backend.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary px-3 py-1 font-mono text-xs">
                  Auto-Generated MRN
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mrn" className="text-xs font-semibold text-muted-foreground">
                  Medical Record Number (MRN)
                </Label>
                <Input
                  id="mrn"
                  value={mrn}
                  readOnly
                  className="bg-muted font-mono font-bold text-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                  Patient Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-xs font-semibold text-muted-foreground">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={gender} onValueChange={(val: "male" | "female") => setGender(val)}>
                  <SelectTrigger id="gender" className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-xs font-semibold text-muted-foreground">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                  Patient Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                  Linked Account Email
                </Label>
                <Input
                  id="email"
                  value={initData?.user.email || ""}
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground">
                  Home Address
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Patient's home address..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Data Wali */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="type-heading flex items-center gap-2">
                <User className="size-5 text-primary" />
                Patient Guardian (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guardianName" className="text-xs font-semibold text-muted-foreground">
                  Guardian Name
                </Label>
                <Input
                  id="guardianName"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Family member or responsible guardian"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianPhone" className="text-xs font-semibold text-muted-foreground">
                  Guardian Phone Number
                </Label>
                <Input
                  id="guardianPhone"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="08123456789"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Informasi Medis Awal */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="type-heading flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Initial Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="diagnosis" className="text-xs font-semibold text-muted-foreground">
                  Primary Diagnosis / Initial Notes
                </Label>
                <Input
                  id="diagnosis"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  placeholder="Example: Primary Hypertension Evaluation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions" className="text-xs font-semibold text-muted-foreground">
                  Medical History / Conditions (comma separated)
                </Label>
                <Input
                  id="conditions"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="Example: Hypertension, Asthma, Gastritis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-xs font-semibold text-muted-foreground">
                  Drug / Food Allergies (comma separated)
                </Label>
                <Input
                  id="allergies"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="Example: Penicillin, Seafood"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={isSaving}
              className="rounded-full px-5"
            >
              <Link href={routes.hospital.requests}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-full px-6 gap-2 font-semibold shadow-sm"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save & Register Patient
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

