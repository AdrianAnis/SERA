import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  leading?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, leading, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-wrap items-center justify-between gap-4 px-4 pt-6 md:px-6", className)}>
      <div className="flex items-center gap-4">
        {leading}
        <div className="space-y-1">
          <h1 className="type-title">{title}</h1>
          {description ? <p className="type-caption">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
