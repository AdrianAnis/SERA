import Image from "next/image"

import { cn } from "@/lib/utils"

type LandingPhotoProps = {
  photoId: string
  alt: string
  width: number
  isPriority?: boolean
  className?: string
}

function buildPhotoUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`
}

export function LandingPhoto({ photoId, alt, width, isPriority = false, className }: LandingPhotoProps) {
  return (
    <Image
      src={buildPhotoUrl(photoId, width)}
      alt={alt}
      width={width}
      height={Math.round(width * 0.66)}
      priority={isPriority}
      unoptimized
      className={cn("size-full object-cover", className)}
    />
  )
}
