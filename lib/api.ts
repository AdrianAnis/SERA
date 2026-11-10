import type { Doctor, HealthHistoryEntry, Patient, PatientRecord } from "@/features/patient/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL


export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  error?: string
  meta?: Record<string, unknown>
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const json: ApiResponse<T> = await res.json()

    if (!res.ok || !json.success) {
      throw new Error(json.message || json.error || `HTTP error ${res.status}`)
    }

    return json.data as T
  } catch (error) {
    console.error(`[API Error] ${path}:`, error)
    throw error
  }
}

export const patientApi = {
  /**
   * Validasi Nomor Rekam Medis (MRN) sesuai flowchart
   */
  validateMrn: (mrn: string) => {
    return request<Patient>(`/hospital/patients/validate?mrn=${encodeURIComponent(mrn)}`)
  },

  /**
   * Ambil daftar pasien dari backend
   */
  getPatients: (params?: { query?: string; mrn?: string; name?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.set("query", params.query)
    if (params?.mrn) searchParams.set("mrn", params.mrn)
    if (params?.name) searchParams.set("name", params.name)
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.page) searchParams.set("page", String(params.page))

    const queryStr = searchParams.toString()
    return request<Patient[]>(`/hospital/patients${queryStr ? `?${queryStr}` : ""}`)
  },

  /**
   * Ambil detail pasien
   */
  getPatientById: (id: string) => {
    return request<Patient>(`/hospital/patients/${id}`)
  },

  /**
   * Ambil riwayat rekam medis pasien
   */
  getPatientHistory: (id: string) => {
    return request<HealthHistoryEntry[]>(`/hospital/patients/${id}/history`)
  },

  /**
   * Ambil rekam medis lengkap (pasien + dokter + riwayat)
   */
  getPatientRecord: (id: string) => {
    return request<PatientRecord>(`/hospital/patients/${id}/record`)
  },
}

