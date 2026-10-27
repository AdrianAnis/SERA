import { ClipboardList, House, MessageCircleHeart, UserRound, type LucideIcon } from "lucide-react"

import { routes } from "@/lib/routes"

export type PatientNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const PATIENT_NAV_ITEMS: PatientNavItem[] = [
  { href: routes.patient.today, label: "Hari Ini", icon: House },
  { href: routes.patient.carePlan, label: "Care Plan", icon: ClipboardList },
  { href: routes.patient.companion, label: "Companion", icon: MessageCircleHeart },
]

export const PATIENT_PROFILE_NAV_ITEM: PatientNavItem = {
  href: routes.patient.profile,
  label: "Profil",
  icon: UserRound,
}
