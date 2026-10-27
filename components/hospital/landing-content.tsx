import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  HERO_PHOTO_ALT,
  HERO_PHOTO_ID,
  LANDING_FEATURES,
  LANDING_QUESTIONS,
  LANDING_STEPS,
} from "@/components/hospital/landing-copy"
import { BrandLogo } from "@/components/brand-logo"
import { LandingPhoto } from "@/components/hospital/landing-photo"
import { Reveal } from "@/components/reveal"
import { RingOrnament } from "@/components/ring-ornament"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#fitur", label: "Fitur" },
  { href: "#tanya-jawab", label: "Tanya jawab" },
]

export function LandingContent() {
  return (
    <div className="min-h-dvh bg-surface-warm">
      <header className="sticky top-0 z-40 border-b bg-surface-warm/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link href={routes.hospital.landing} aria-label="Sera">
            <BrandLogo />
          </Link>
          <nav aria-label="Navigasi landing" className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
          <Button asChild size="lg">
            <Link href={routes.hospital.login}>Masuk</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 text-center md:px-8 lg:pt-24">
          <h1 className="type-display-serif mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
            Care plan yang <em>benar-benar</em> dijalankan pasien di rumah.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards delay-150">
            Konfirmasi care plan sekali. Pasien langsung menerima pengingat dan pendamping yang berpegang pada instruksi Anda.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards delay-300">
            <Button asChild size="lg" className="h-12 px-6">
              <Link href={routes.hospital.login}>
                Masuk sebagai dokter
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 bg-card px-6">
              <a href="#cara-kerja">Lihat cara kerja</a>
            </Button>
          </div>
          <div className="mt-14 aspect-video overflow-hidden rounded-3xl animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-backwards">
            <LandingPhoto photoId={HERO_PHOTO_ID} alt={HERO_PHOTO_ALT} width={1600} isPriority />
          </div>
        </section>

        <section id="cara-kerja" className="mx-auto max-w-6xl scroll-mt-20 space-y-20 px-4 py-20 md:px-8 lg:space-y-28 lg:py-28">
          {LANDING_STEPS.map((step, index) => (
            <Reveal key={step.number}>
              <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={cn("aspect-4/3 overflow-hidden rounded-3xl", index % 2 === 1 && "lg:order-last")}>
                <LandingPhoto photoId={step.photoId} alt={step.photoAlt} width={1000} />
              </div>
              <div className="space-y-5">
                <p className="text-sm font-medium text-primary tabular-nums">{step.number}</p>
                <h2 className="type-title">{step.title}</h2>
                <p className="text-base leading-relaxed text-muted-foreground">{step.text}</p>
                <ul className="space-y-2 border-l-2 border-primary/30 pl-4 text-sm">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              </article>
            </Reveal>
          ))}
        </section>

        <section id="fitur" className="scroll-mt-20 border-y bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 lg:py-28">
            <Reveal>
              <h2 className="type-title max-w-lg">Semua yang dokter butuhkan untuk menyusun dan memantau.</h2>
            </Reveal>
            <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delayMs={(index % 3) * 100} className="border-t pt-5">
                  <dt className="type-subheading">{feature.title}</dt>
                  <dd className="mt-2 type-caption">{feature.text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <section id="tanya-jawab" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-20 md:px-8 lg:grid-cols-3 lg:py-28">
          <Reveal>
            <h2 className="type-title max-w-xs">Pertanyaan yang sering muncul.</h2>
          </Reveal>
          <dl className="divide-y border-y lg:col-span-2">
            {LANDING_QUESTIONS.map((item, index) => (
              <Reveal key={item.question} delayMs={index * 100} className="grid gap-2 py-6">
                <dt className="type-subheading">{item.question}</dt>
                <dd className="text-base leading-relaxed text-muted-foreground">{item.answer}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8 lg:pb-24">
          <Reveal className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
            <RingOrnament />
            <h2 className="relative type-title text-primary-foreground">Mulai dari satu konfirmasi.</h2>
            <p className="relative mt-2 max-w-lg text-primary-foreground/80">
              Masuk ke workspace dokter, susun care plan, dan lihat pasien menerimanya saat itu juga.
            </p>
            <Button asChild size="lg" className="relative mt-6 h-12 bg-primary-foreground px-6 text-primary hover:bg-primary-foreground/90">
              <Link href={routes.hospital.login}>
                Masuk sebagai dokter
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>
    </div>
  )
}
