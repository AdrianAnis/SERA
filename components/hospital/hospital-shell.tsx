import { DoctorSessionGate } from "@/components/hospital/doctor-session-gate"
import { MobileTopbar } from "@/components/hospital/mobile-topbar"
import { SidebarContent } from "@/components/hospital/sidebar-content"

type HospitalShellProps = {
  children: React.ReactNode
}

export function HospitalShell({ children }: HospitalShellProps) {
  return (
    <div className="min-h-dvh lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r lg:block">
        <SidebarContent />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="flex min-w-0 flex-1 flex-col">
          <DoctorSessionGate>{children}</DoctorSessionGate>
        </main>
      </div>
    </div>
  )
}
