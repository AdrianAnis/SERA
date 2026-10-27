"use client"

import { useEffect } from "react"

import { useAuthStore } from "@/features/auth/store"
import { useCarePlanStore } from "@/features/care-plan/store"
import { useCompanionStore } from "@/features/companion/store"
import { useConsultationStore } from "@/features/consultation/store"
import { useFeedbackStore } from "@/features/feedback/store"
import { usePatientStore } from "@/features/patient/store"
import { useWearableStore } from "@/features/wearable/store"

export type PersistedStore = {
  persist: {
    getOptions: () => { name?: string }
    rehydrate: () => Promise<void> | void
    hasHydrated: () => boolean
    onFinishHydration: (listener: () => void) => () => void
  }
}

export const persistedStores: PersistedStore[] = [
  useAuthStore,
  useCarePlanStore,
  usePatientStore,
  useFeedbackStore,
  useCompanionStore,
  useConsultationStore,
  useWearableStore,
]

function rehydrateStores(): void {
  persistedStores.forEach((store) => void store.persist.rehydrate())
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.storageArea !== window.localStorage) return
  persistedStores
    .filter((store) => event.key === null || event.key === store.persist.getOptions().name)
    .forEach((store) => void store.persist.rehydrate())
}

export function useStorageSync(): void {
  useEffect(() => {
    rehydrateStores()
    window.addEventListener("storage", handleStorageEvent)
    return () => window.removeEventListener("storage", handleStorageEvent)
  }, [])
}
