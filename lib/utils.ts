import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`)
}

export function getInitials(name: string): string {
  return (name.replace(/^dr\.\s*/i, "").split(",")[0] ?? name)
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
