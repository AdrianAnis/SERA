import { History, LineChart, UserRound, type LucideIcon } from "lucide-react"

export type ProfileSectionValue = "data" | "aktivitas" | "riwayat"

export type ProfileSection = {
  value: ProfileSectionValue
  label: string
  icon: LucideIcon
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  { value: "data", label: "Data diri", icon: UserRound },
  { value: "aktivitas", label: "Aktivitas", icon: LineChart },
  { value: "riwayat", label: "Riwayat care plan", icon: History },
]

export const DEFAULT_PROFILE_SECTION: ProfileSectionValue = "data"
