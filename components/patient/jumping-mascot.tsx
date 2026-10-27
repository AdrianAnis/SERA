"use client"

import { useState } from "react"

import { Mascot } from "@/components/mascot"
import type { MascotPose } from "@/features/mascot/types"
import { cn } from "@/lib/utils"

type JumpingMascotProps = {
  pose: MascotPose
  label: string
  className?: string
}

export function JumpingMascot({ pose, label, className }: JumpingMascotProps) {
  const [isJumping, setIsJumping] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setIsJumping(true)}
      onAnimationEnd={(event) => (event.target === event.currentTarget ? setIsJumping(false) : undefined)}
      className={cn("cursor-pointer", isJumping && "animate-[mascot-jump_0.6s_ease-out] motion-reduce:animate-none", className)}
    >
      <Mascot pose={pose} className="mascot-float" />
    </button>
  )
}
