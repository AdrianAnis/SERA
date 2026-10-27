"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, UserRound } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { PATIENT_NAV_ITEMS } from "@/components/patient/nav-items"
import { RingOrnament } from "@/components/ring-ornament"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePatientActions } from "@/features/patient/use-patient-actions"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { routes } from "@/lib/routes"
import { cn, getInitials } from "@/lib/utils"


export function TopNav() {
  const pathname = usePathname()
  const { patient, activeDoctor } = usePatientContext()
  const { logout } = usePatientActions()

  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden h-16 border-b bg-card/95 backdrop-blur md:block">
      <nav aria-label="Navigasi utama" className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-8">
        <Link href={routes.patient.today} aria-label="Sera">
          <BrandLogo />
        </Link>

        <ul className="flex h-full items-center gap-1">
          {PATIENT_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={href} className="h-full">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-full items-center gap-2 px-4 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                  {isActive ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t-full bg-primary" /> : null}
                </Link>
              </li>
            )
          })}
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex min-h-11 items-center gap-3 rounded-full py-1 pr-2 pl-3 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-sm font-medium">{patient?.name}</span>
            <Avatar>
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">{patient ? getInitials(patient.name) : ""}</AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-72 overflow-hidden rounded-2xl p-0">
            <DropdownMenuLabel className="relative overflow-hidden bg-primary p-5 text-primary-foreground">
              <RingOrnament />
              <div className="relative flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary-foreground/20 font-semibold text-primary-foreground">
                    {patient ? getInitials(patient.name) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{patient?.name}</p>
                  <p className="text-sm font-normal text-primary-foreground/80">{patient?.mrn}</p>
                </div>
              </div>
              {activeDoctor ? <p className="relative mt-3 text-xs font-normal text-primary-foreground/80">{activeDoctor.hospital}</p> : null}
            </DropdownMenuLabel>
            <div className="space-y-1 p-2">
              <DropdownMenuItem asChild className="min-h-12 gap-3 rounded-xl px-2 text-sm font-medium">
                <Link href={routes.patient.profile}>
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <UserRound className="size-4" />
                  </span>
                  Lihat profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" className="min-h-12 gap-3 rounded-xl px-2 text-sm font-medium" onSelect={logout}>
                <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                  <LogOut className="size-4" />
                </span>
                Keluar
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
