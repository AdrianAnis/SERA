"use client"

import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CompanionInputProps = {
  isDisabled: boolean
  onSend: (question: string) => void
}

export function CompanionInput({ isDisabled, onSend }: CompanionInputProps) {
  const [draft, setDraft] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Label htmlFor="companion-question" className="sr-only">
        Pertanyaan untuk Companion
      </Label>
      <Input
        id="companion-question"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Tulis pertanyaan kamu..."
        autoComplete="off"
        className="h-14 rounded-full bg-card pr-16 pl-5 text-base"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Kirim pertanyaan"
        disabled={isDisabled || draft.trim().length === 0}
        className="absolute top-1/2 right-2 size-10 -translate-y-1/2 rounded-full"
      >
        <Send />
      </Button>
    </form>
  )
}
