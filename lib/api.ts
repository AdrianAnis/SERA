import type { Doctor, HealthHistoryEntry, Patient, PatientRecord } from "@/features/patient/types"
import type { DoctorLoginValues, PatientSignInValues, PatientSignUpValues } from "@/features/auth/schema"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  error?: string
  meta?: Record<string, unknown>
}

export type AuthUser = {
  id: string
  role: "doctor" | "patient"
  email: string
  name: string
  phone?: string | null
  isVerified: boolean
  doctorId?: string | null
  patientId?: string | null
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

/**
 * Custom Error Class separating:
 * - userMessage: Clean, safe, user-friendly English message for UI display
 * - developerMessage: Full technical details and stack trace for developer console
 */
export class ApiError extends Error {
  statusCode: number
  developerMessage: string
  userMessage: string

  constructor(userMessage: string, developerMessage: string, statusCode: number = 500) {
    super(userMessage)
    this.name = "ApiError"
    this.userMessage = userMessage
    this.developerMessage = developerMessage
    this.statusCode = statusCode
  }
}

function isTechnicalMessage(msg?: string): boolean {
  if (!msg) return false
  const lower = msg.toLowerCase()
  return (
    lower.includes("route") ||
    lower.includes("not found") ||
    lower.includes("cannot get") ||
    lower.includes("cannot post") ||
    lower.includes("internal server") ||
    lower.includes("sql") ||
    lower.includes("database") ||
    lower.includes("econnrefused") ||
    lower.includes("syntaxerror") ||
    lower.includes("typeerror") ||
    lower.includes("jwt") ||
    lower.includes("token") ||
    lower.includes("rute")
  )
}

function resolveUserFacingMessage(status: number, serverMessage?: string): string {
  // Never leak technical routing or internal stack traces to users
  if (serverMessage && !isTechnicalMessage(serverMessage)) {
    return serverMessage
  }

  switch (status) {
    case 400:
      return "Invalid input. Please check the information provided and try again."
    case 401:
      return "Invalid email or password. Please check your credentials and try again."
    case 403:
      return "Access denied. You do not have permission to access this service."
    case 404:
      return "The requested service or account was not found. Please try again."
    case 409:
      return "An account with this email already exists. Please sign in instead."
    case 422:
      return "Validation failed. Please verify your submitted data."
    case 500:
    case 502:
    case 503:
      return "Our servers are currently experiencing issues. Please try again later."
    default:
      return "An unexpected error occurred. Please try again."
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const method = options?.method || "GET"

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    let json: ApiResponse<T> | null = null
    try {
      json = await res.json()
    } catch {
      // Non-JSON response
    }

    if (!res.ok || !json?.success) {
      const serverMsg = json?.message || json?.error || `HTTP ${res.status} ${res.statusText}`
      const userMsg = resolveUserFacingMessage(res.status, json?.message)
      const devMsg = `[API Error ${res.status}] ${method} ${path} -> ${serverMsg}`

      // Log ke developer console dengan detail teknis lengkap
      console.error("[Developer Debug Info]", {
        endpoint: path,
        method,
        status: res.status,
        statusText: res.statusText,
        backendError: json?.error,
        backendMessage: json?.message,
        timestamp: new Date().toISOString(),
      })

      throw new ApiError(userMsg, devMsg, res.status)
    }

    return json.data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network error or server unreachable
    const devMsg = `[Network Failure] Cannot connect to ${url}: ${(error as Error).message}`
    const userMsg = "Unable to connect to the server. Please check your network connection and make sure the server is running."

    console.error("[Developer Network Debug]", {
      endpoint: path,
      method,
      url,
      rawError: error,
      hint: "Make sure Backend is running on port 3000 and NEXT_PUBLIC_API_URL is configured properly.",
    })

    throw new ApiError(userMsg, devMsg, 0)
  }
}

export const authApi = {
  /**
   * Login Dokter ke Hospital Platform
   */
  loginDoctor: (credentials: DoctorLoginValues) => {
    return request<AuthResponse>("/auth/doctor/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  /**
   * Login Pasien ke SERA Patient App
   */
  loginPatient: (credentials: PatientSignInValues) => {
    return request<AuthResponse>("/auth/patient/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  /**
   * Registrasi Pasien di SERA Patient App
   */
  registerPatient: (data: PatientSignUpValues) => {
    return request<AuthResponse>("/auth/patient/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Kirim OTP untuk verifikasi
   */
  sendOtp: (data: { identifier: string; purpose?: "registration" | "login" | "verification" }) => {
    return request<{ identifier: string; message: string; previewCode?: string }>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Verifikasi OTP
   */
  verifyOtp: (data: { identifier: string; code: string; purpose?: "registration" | "login" | "verification" }) => {
    return request<boolean>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Mengambil profil aktif dengan Bearer token
   */
  getMe: (token: string) => {
    return request<AuthUser>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
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

export type PatientSeraStatus = "connected" | "pending" | "unlinked_registered" | "unregistered"

export type FaskesLinkRequest = {
  id: string
  patientId: string
  doctorId: string
  userId?: string | null
  status: "pending" | "approved" | "rejected" | "expired"
  requestedBy: string
  notes?: string | null
  respondedAt?: string | null
  createdAt: string
  updatedAt: string
  doctorName?: string
  doctorSpecialty?: string
  hospitalName?: string
  patientName?: string
  patientMrn?: string
}

export type PatientInvitation = {
  id: string
  patientId: string
  doctorId: string
  token: string
  recipientPhone: string
  recipientEmail?: string | null
  status: "sent" | "accepted" | "expired"
  expiresAt: string
  acceptedAt?: string | null
  createdAt: string
  updatedAt: string
  doctorName?: string
  hospitalName?: string
  patientName?: string
  patientMrn?: string
  activationUrl?: string
}

export type SeraStatusResponse = {
  patientId: string
  mrn: string
  patientName: string
  status: PatientSeraStatus
  user?: {
    id: string
    email: string
    name: string
    phone?: string | null
    isVerified: boolean
  } | null
  pendingRequest?: FaskesLinkRequest | null
  latestInvitation?: PatientInvitation | null
}

export const connectionApi = {
  /**
   * Cek status koneksi akun SERA pasien (Hospital / Doctor)
   */
  getSeraStatus: (patientId: string) => {
    return request<SeraStatusResponse>(`/hospital/patients/${patientId}/sera-status`)
  },

  /**
   * Kirim permintaan penghubungan ke pasien yang sudah terdaftar di SERA
   */
  requestLink: (patientId: string, data?: { notes?: string; userId?: string }) => {
    return request<FaskesLinkRequest>(`/hospital/patients/${patientId}/request-link`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    })
  },

  /**
   * Generate undangan aktivasi untuk pasien yang belum punya akun
   */
  invitePatient: (patientId: string, data?: { recipientPhone?: string; recipientEmail?: string }) => {
    return request<PatientInvitation>(`/hospital/patients/${patientId}/invite`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    })
  },

  /**
   * Ambil daftar permintaan penghubungan faskes yang masuk ke pasien
   */
  getPendingRequests: (token?: string) => {
    return request<FaskesLinkRequest[]>("/patient/link-requests", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },

  /**
   * Pasien menyetujui permintaan penghubungan faskes
   */
  approveLinkRequest: (requestId: string, token?: string) => {
    return request<{ patientId: string; patientName: string; mrn: string; doctorName?: string; hospitalName?: string }>(
      `/patient/link-requests/${requestId}/approve`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )
  },

  /**
   * Pasien menolak permintaan penghubungan faskes
   */
  rejectLinkRequest: (requestId: string, token?: string) => {
    return request<{ success: boolean; message: string }>(
      `/patient/link-requests/${requestId}/reject`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )
  },

  /**
   * Verifikasi token undangan aktivasi
   */
  verifyInvitation: (token: string) => {
    return request<PatientInvitation>(`/patient/invitations/verify?token=${encodeURIComponent(token)}`)
  },

  /**
   * Pasien menerima token undangan dan menautkan profil
   */
  acceptInvitation: (token: string, authToken?: string) => {
    return request<{ patientId: string; patientName: string; mrn: string; hospitalName?: string }>(
      "/patient/invitations/accept",
      {
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        body: JSON.stringify({ token }),
      }
    )
  },
}
