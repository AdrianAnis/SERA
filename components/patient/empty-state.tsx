import { Mascot } from "@/components/mascot"

type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-card p-10 text-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-primary">
        <Mascot pose="thinking" className="mascot-float w-14" />
      </span>
      <h2 className="mt-4 type-heading">{title}</h2>
      <p className="mt-1 max-w-sm text-muted-foreground">{description}</p>
    </div>
  )
}
