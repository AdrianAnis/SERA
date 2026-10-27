import { cn } from "@/lib/utils"

const RING_SIZES = ["size-48", "size-72", "size-96", "size-128"]

export function RingOrnament() {
  return (
    <div className="pointer-events-none absolute -right-6 -bottom-10" aria-hidden="true">
      {RING_SIZES.map((size) => (
        <span
          key={size}
          className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10", size)}
        />
      ))}
    </div>
  )
}
