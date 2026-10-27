import { Mascot } from "@/components/mascot"
import { cn } from "@/lib/utils"

type MascotAvatarProps = {
  className?: string
}

export function MascotAvatar({ className }: MascotAvatarProps) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-full bg-primary", className)}>
      <Mascot pose="happy" className="mx-auto mt-[8%] w-[88%]" />
    </span>
  )
}
