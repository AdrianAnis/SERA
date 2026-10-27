import { HospitalShell } from "@/components/hospital/hospital-shell"

export default function HospitalAppLayout({ children }: { children: React.ReactNode }) {
  return <HospitalShell>{children}</HospitalShell>
}
