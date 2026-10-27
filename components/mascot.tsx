import Image from "next/image"

import { MASCOT_POSE_SRC } from "@/features/mascot/labels"
import type { MascotPose } from "@/features/mascot/types"
import { cn } from "@/lib/utils"

type MascotProps = {
  pose: MascotPose
  className?: string
  isPriority?: boolean
}

const MASCOT_IMAGE_WIDTH = 124
const MASCOT_IMAGE_HEIGHT = 134

export function Mascot({ pose, className, isPriority = false }: MascotProps) {
  return (
    <Image
      src={MASCOT_POSE_SRC[pose]}
      alt=""
      width={MASCOT_IMAGE_WIDTH}
      height={MASCOT_IMAGE_HEIGHT}
      unoptimized
      priority={isPriority}
      className={cn("h-auto w-full object-contain", className)}
    />
  )
}
