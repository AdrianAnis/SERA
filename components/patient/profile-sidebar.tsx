import { LogOut } from "lucide-react"

import { PROFILE_SECTIONS, type ProfileSectionValue } from "@/components/patient/profile-sections"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Patient } from "@/features/patient/types"
import { cn, getInitials } from "@/lib/utils"

type ProfileSidebarProps = {
  patient: Patient
  activeSection: ProfileSectionValue
  onSelect: (section: ProfileSectionValue) => void
  onLogout: () => void
}

const MENU_ITEM_CLASS = "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors"


export function ProfileSidebar({ patient, activeSection, onSelect, onLogout }: ProfileSidebarProps) {
  return (
    <aside className="rounded-3xl border bg-card p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-4 md:flex-col md:text-center">
        <Avatar className="size-16 md:size-24">
          <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary md:text-3xl">{getInitials(patient.name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="type-subheading">{patient.name}</p>
          <p className="type-caption">{patient.mrn}</p>
        </div>
      </div>

      <nav aria-label="Menu profil" className="mt-6 space-y-1">
        {PROFILE_SECTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = value === activeSection
          return (
            <button
              key={value}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(value)}
              className={cn(MENU_ITEM_CLASS, isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
            >
              <Icon className="size-4" />
              {label}
            </button>
          )
        })}
        <Separator className="my-3 bg-border" />
        <button type="button" onClick={onLogout} className={cn(MENU_ITEM_CLASS, "text-destructive hover:bg-destructive/10")}>
          <LogOut className="size-4" />
          Keluar
        </button>
      </nav>
    </aside>
  )
}
