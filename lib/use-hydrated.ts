"use client"

import { useSyncExternalStore } from "react"

import { persistedStores } from "@/lib/storage-sync"

function subscribe(listener: () => void): () => void {
  const unsubscribers = persistedStores.map((store) => store.persist.onFinishHydration(listener))
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
}

function getSnapshot(): boolean {
  return persistedStores.every((store) => store.persist.hasHydrated())
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
