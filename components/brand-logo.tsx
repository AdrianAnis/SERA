import { HeartHandshake } from "lucide-react"

import { cn } from "@/lib/utils"

type BrandLogoSize = "sm" | "md" | "lg"

type BrandLogoProps = {
  size?: BrandLogoSize
  isInverted?: boolean
  hasName?: boolean
  caption?: string
  className?: string
}

const MARK_CLASS: Record<BrandLogoSize, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-14",
}

const ICON_CLASS: Record<BrandLogoSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
}

const NAME_CLASS: Record<BrandLogoSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-3xl",
}

export function BrandLogo({ size = "md", isInverted = false, hasName = true, caption, className }: BrandLogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5 font-semibold", isInverted ? "text-primary-foreground" : "text-primary", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          MARK_CLASS[size],
          isInverted ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
        )}
      >
        <HeartHandshake className={ICON_CLASS[size]} />
      </span>
      {hasName ? (
        <span className="flex flex-col leading-tight">
          <span className={cn("tracking-tight", NAME_CLASS[size])}>Sera</span>
          {caption ? <span className="text-xs font-normal opacity-60">{caption}</span> : null}
        </span>
      ) : null}
    </span>
  )
}
