import { PatientShell } from "@/components/patient/patient-shell"

export default function PatientAppLayout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>
}
