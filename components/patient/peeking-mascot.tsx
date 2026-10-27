import { Mascot } from "@/components/mascot"

export function PeekingMascot() {
  return (
    <div className="pointer-events-none absolute right-4 bottom-0 w-28 md:right-10" aria-hidden="true">
      <div className="mascot-peek-edge">
        <Mascot pose="clipboard" className="mascot-sway origin-bottom" />
      </div>
    </div>
  )
}
