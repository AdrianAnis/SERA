import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"

import "../globals.css"

import { StoreSync } from "@/components/store-sync"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Sera",
    template: "%s · Sera",
  },
  description: "Teman pemulihan Anda: pengingat obat, anjuran makan, dan aktivitas sesuai rencana dokter.",
}

export const viewport: Viewport = {
  themeColor: "#f6efe4",
  width: "device-width",
  initialScale: 1,
}

export default function PatientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="theme-patient min-h-dvh">
        <StoreSync />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
