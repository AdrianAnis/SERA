"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ChatBubble } from "@/components/patient/chat-bubble"
import { CompanionEmptyState } from "@/components/patient/companion-empty-state"
import { CompanionInput } from "@/components/patient/companion-input"
import { CompanionQuickActions } from "@/components/patient/companion-quick-actions"
import { TopNav } from "@/components/patient/top-nav"
import { selectThread } from "@/features/companion/selectors"
import { useCompanionStore } from "@/features/companion/store"
import { selectFirstName } from "@/features/patient/selectors"
import { usePatientStore } from "@/features/patient/store"
import { usePatientContext } from "@/features/patient/use-patient-context"
import { routes } from "@/lib/routes"

const TYPING_DELAY_MS = 800

export function CompanionView() {
  const { patient, activePlan } = usePatientContext()
  const doctors = usePatientStore((state) => state.doctors)
  const threads = useCompanionStore((state) => state.threads)
  const askQuestion = useCompanionStore((state) => state.askQuestion)
  const reportMessage = useCompanionStore((state) => state.reportMessage)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const thread = patient ? selectThread(threads, patient.id) : []
  const isEmpty = thread.length === 0 && pendingQuestion === null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [thread.length, pendingQuestion])

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  if (!patient) return null

  function sendQuestion(question: string): void {
    const trimmed = question.trim()
    if (!patient || !trimmed || pendingQuestion !== null) return
    setPendingQuestion(trimmed)
    timerRef.current = window.setTimeout(() => {
      askQuestion(patient.id, trimmed, activePlan)
      setPendingQuestion(null)
    }, TYPING_DELAY_MS)
  }

  return (
    <div className="flex h-dvh flex-col bg-background md:pt-16">
      <TopNav />
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b px-2 md:hidden">
        <Link
          href={routes.patient.today}
          aria-label="Kembali ke Hari Ini"
          className="absolute left-2 flex size-11 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <p className="type-subheading">Companion</p>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div aria-live="polite" className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
          {isEmpty ? (
            <CompanionEmptyState firstName={selectFirstName(patient)} isDisabled={pendingQuestion !== null} onSelect={sendQuestion} />
          ) : null}
          {thread.map((message) => (
            <ChatBubble key={message.id} message={message} doctors={doctors} onReport={(messageId) => reportMessage(patient.id, messageId)} />
          ))}
          {pendingQuestion ? (
            <>
              <div className="flex justify-end">
                <div className="max-w-xs rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground sm:max-w-md">{pendingQuestion}</div>
              </div>
              <p className="type-caption">Companion sedang mengetik...</p>
            </>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-3xl">
          <CompanionQuickActions isDisabled={pendingQuestion !== null} onSelect={sendQuestion} />
          <CompanionInput isDisabled={pendingQuestion !== null} onSend={sendQuestion} />
        </div>
      </footer>
    </div>
  )
}
