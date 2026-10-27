"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { PATIENT_NAV_ITEMS, PATIENT_PROFILE_NAV_ITEM } from "@/components/patient/nav-items"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {[...PATIENT_NAV_ITEMS, PATIENT_PROFILE_NAV_ITEM].map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("rounded-full px-4 py-1 transition-colors", isActive && "bg-primary/10")}>
                  <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
