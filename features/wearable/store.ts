import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { WearableMetric } from "@/features/wearable/schema"
import type { MetricTrend, WearableConnection, WearablePeriod } from "@/features/wearable/types"
import { DEFAULT_WEARABLE_DEVICE_NAME, mockWearableConnections } from "@/mocks/wearable"
import { wearableApi } from "@/lib/api"

const WEARABLE_STORAGE_KEY = "hc:wearable"

type WearableState = {
  connections: Record<string, WearableConnection>
  trends: Record<string, Record<WearableMetric, MetricTrend>>
  isLoading: boolean
  fetchStatus: (patientId: string, token?: string) => Promise<void>
  fetchTrends: (patientId: string, period?: WearablePeriod, anchor?: string, token?: string) => Promise<Record<WearableMetric, MetricTrend> | null>
  connectWearable: (patientId: string, deviceName?: string, token?: string) => Promise<void>
  disconnectWearable: (patientId: string, token?: string) => Promise<void>
  syncWearable: (patientId: string, token?: string) => Promise<void>
}

export const useWearableStore = create<WearableState>()(
  persist(
    (set, get) => ({
      connections: mockWearableConnections,
      trends: {},
      isLoading: false,

      fetchStatus: async (patientId, token) => {
        if (!token) return
        try {
          const res = await wearableApi.getStatus(token)
          if (res?.isConnected && res.connection) {
            set((state) => ({
              connections: {
                ...state.connections,
                [patientId]: {
                  deviceName: res.connection?.deviceName || DEFAULT_WEARABLE_DEVICE_NAME,
                  deviceModel: res.connection?.deviceModel || null,
                  connectedAt: res.connection?.connectedAt || new Date().toISOString(),
                  lastSyncAt: res.connection?.lastSyncAt || null,
                  isConnected: true,
                },
              },
            }))
          } else {
            set((state) => ({
              connections: Object.fromEntries(Object.entries(state.connections).filter(([id]) => id !== patientId)),
            }))
          }
        } catch (err) {
          console.error("[useWearableStore] Failed to fetch status from backend:", err)
        }
      },

      fetchTrends: async (patientId, period = "day", anchor, token) => {
        if (!token) return null
        set({ isLoading: true })
        try {
          const res = await wearableApi.getTrends(period, undefined, anchor, token)
          if (res && typeof res === "object" && "steps" in res) {
            const metricTrends = res as Record<WearableMetric, MetricTrend>
            set((state) => ({
              trends: {
                ...state.trends,
                [patientId]: metricTrends,
              },
              isLoading: false,
            }))
            return metricTrends
          }
          set({ isLoading: false })
          return null
        } catch (err) {
          console.error("[useWearableStore] Failed to fetch trends from backend:", err)
          set({ isLoading: false })
          return null
        }
      },

      connectWearable: async (patientId, deviceName, token) => {
        const name = deviceName || DEFAULT_WEARABLE_DEVICE_NAME
        set({ isLoading: true })
        try {
          if (token) {
            const res = await wearableApi.connect(name, token)
            set((state) => ({
              connections: {
                ...state.connections,
                [patientId]: {
                  deviceName: res?.deviceName || name,
                  deviceModel: res?.deviceModel || null,
                  connectedAt: res?.connectedAt || new Date().toISOString(),
                  lastSyncAt: new Date().toISOString(),
                  isConnected: true,
                },
              },
              isLoading: false,
            }))
            // Immediately fetch fresh trends from BE
            await get().fetchTrends(patientId, "day", undefined, token)
            return
          }
        } catch (err) {
          console.error("[useWearableStore] Failed to connect smartwatch on backend:", err)
        }

        // Fallback local update
        set((state) => ({
          connections: {
            ...state.connections,
            [patientId]: { deviceName: name, connectedAt: new Date().toISOString() },
          },
          isLoading: false,
        }))
      },

      disconnectWearable: async (patientId, token) => {
        set({ isLoading: true })
        try {
          if (token) {
            await wearableApi.disconnect(token)
          }
        } catch (err) {
          console.error("[useWearableStore] Failed to disconnect smartwatch on backend:", err)
        } finally {
          set((state) => ({
            connections: Object.fromEntries(Object.entries(state.connections).filter(([id]) => id !== patientId)),
            trends: Object.fromEntries(Object.entries(state.trends).filter(([id]) => id !== patientId)),
            isLoading: false,
          }))
        }
      },

      syncWearable: async (patientId, token) => {
        if (!token) return
        set({ isLoading: true })
        try {
          const connection = get().connections[patientId]
          await wearableApi.sync(
            {
              deviceName: connection?.deviceName || DEFAULT_WEARABLE_DEVICE_NAME,
            },
            token
          )
          const nowIso = new Date().toISOString()
          set((state) => {
            const existing = state.connections[patientId]
            if (!existing) return state
            return {
              connections: {
                ...state.connections,
                [patientId]: {
                  ...existing,
                  lastSyncAt: nowIso,
                },
              },
            }
          })
          await get().fetchTrends(patientId, "day", undefined, token)
        } catch (err) {
          console.error("[useWearableStore] Failed to sync data with backend:", err)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: WEARABLE_STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ connections: state.connections }),
      skipHydration: true,
      migrate: (persistedState: any) => ({
        connections: persistedState?.connections || {},
        trends: {},
        isLoading: false,
      }),
    },
  ),
)
