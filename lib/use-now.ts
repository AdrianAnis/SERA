"use client"

import { useMemo, useSyncExternalStore } from "react"

const MINUTE_IN_MS = 60_000

function subscribe(listener: () => void): () => void {
  const intervalId = window.setInterval(listener, MINUTE_IN_MS / 2)
  return () => window.clearInterval(intervalId)
}

function getSnapshot(): number {
  return Math.floor(Date.now() / MINUTE_IN_MS)
}

function getServerSnapshot(): number {
  return 0
}

export function useNow(): Date {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return useMemo(() => new Date(minute * MINUTE_IN_MS), [minute])
}
