import type { Metadata } from "next"
import Link from "next/link"
import { Nunito } from "next/font/google"

import "./globals.css"

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan · Sera",
}

export default function GlobalNotFound() {
  return (
    <html lang="id" className={nunito.variable}>
      <body className="theme-patient flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-5xl font-extrabold text-primary">404</p>
        <h1 className="text-xl font-bold">Halaman tidak ditemukan</h1>
        <div className="flex gap-4 font-semibold text-primary">
          <Link href="/patient">Aplikasi pasien</Link>
          <Link href="/hospital">Workspace dokter</Link>
        </div>
      </body>
    </html>
  )
}
