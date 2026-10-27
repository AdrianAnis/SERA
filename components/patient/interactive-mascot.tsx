"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

import { MascotAvatar } from "@/components/patient/mascot-avatar"
import { cn } from "@/lib/utils"

const BURST_HEARTS = [
  { position: "-top-1 left-0", delay: "[animation-delay:0s]" },
  { position: "-top-2 left-1/2", delay: "[animation-delay:0.15s]" },
  { position: "-top-1 right-0", delay: "[animation-delay:0.3s]" },
]

export function InteractiveMascot() {
  const [isBursting, setIsBursting] = useState(false)

  return (
    <button
      type="button"
      aria-label="Sapa Sera"
      onClick={() => setIsBursting(true)}
      onAnimationEnd={(event) => (event.target === event.currentTarget ? setIsBursting(false) : undefined)}
      className={cn("mascot-pop-in relative size-16 shrink-0 cursor-pointer md:size-20", isBursting && "animate-[mascot-jump_0.6s_ease-out] motion-reduce:animate-none")}
    >
      <MascotAvatar className="mascot-sway size-full" />
      {isBursting
        ? BURST_HEARTS.map((heart) => (
            <Heart
              key={heart.position}
              className={cn("mascot-heart absolute size-4 fill-destructive text-destructive opacity-0", heart.position, heart.delay)}
              aria-hidden="true"
            />
          ))
        : null}
    </button>
  )
}
