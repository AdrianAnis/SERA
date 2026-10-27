import { Heart } from "lucide-react"

import { JumpingMascot } from "@/components/patient/jumping-mascot"
import { cn } from "@/lib/utils"

const HEARTS = [
  { position: "left-[24%] top-[22%]", delay: "[animation-delay:0s]" },
  { position: "left-[68%] top-[18%]", delay: "[animation-delay:1s]" },
  { position: "left-[46%] top-[10%]", delay: "[animation-delay:2s]" },
]

export function WelcomeScene() {
  return (
    <div className="relative size-full">
      {HEARTS.map((heart) => (
        <Heart key={heart.position} className={cn("mascot-heart absolute size-5 fill-destructive text-destructive opacity-0", heart.position, heart.delay)} aria-hidden="true" />
      ))}
      <span className="absolute inset-x-[18%] bottom-[2%] h-[7%] rounded-full bg-primary-foreground/10" aria-hidden="true" />
      <JumpingMascot pose="greeting" label="Sapa Sera" className="mascot-pop-in absolute inset-x-[22%] bottom-[8%]" />
    </div>
  )
}
