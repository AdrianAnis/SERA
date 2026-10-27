import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { WearableConnection } from "@/features/wearable/types"
import { DEFAULT_WEARABLE_DEVICE_NAME, mockWearableConnections } from "@/mocks/wearable"

const WEARABLE_STORAGE_KEY = "hc:wearable"

type WearableState = {
  connections: Record<string, WearableConnection>
  connectWearable: (patientId: string) => void
  disconnectWearable: (patientId: string) => void
}

export const useWearableStore = create<WearableState>()(
  persist(
    (set) => ({
      connections: mockWearableConnections,
      connectWearable: (patientId) =>
        set((state) => ({
          connections: {
            ...state.connections,
            [patientId]: { deviceName: DEFAULT_WEARABLE_DEVICE_NAME, connectedAt: new Date().toISOString() },
          },
        })),
      disconnectWearable: (patientId) =>
        set((state) => ({
          connections: Object.fromEntries(Object.entries(state.connections).filter(([id]) => id !== patientId)),
        })),
    }),
    {
      name: WEARABLE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ connections: state.connections }),
      skipHydration: true,
    },
  ),
)
