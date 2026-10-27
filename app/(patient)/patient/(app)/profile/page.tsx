import { Suspense } from "react"
import type { Metadata } from "next"

import { PageSkeleton } from "@/components/patient/page-skeleton"
import { ProfileView } from "@/components/patient/profile-view"

export const metadata: Metadata = { title: "Profil" }

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProfileView />
    </Suspense>
  )
}
