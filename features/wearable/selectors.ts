import type { WearableConnection } from "@/features/wearable/types"

export function selectConnection(connections: Record<string, WearableConnection>, patientId: string): WearableConnection | undefined {
  return connections[patientId]
}
