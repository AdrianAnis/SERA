export const ITEM_QUERY_KEY = "item"

export const CONSULTATION_DATE_QUERY_KEY = "tanggal"

export const routes = {
  home: "/",
  hospital: {
    landing: "/hospital",
    login: "/hospital/login",
    dashboard: "/hospital/dashboard",
    patientList: "/hospital/patients",
    requests: "/hospital/requests",
    requestRecord: (requestId: string) => `/hospital/requests/${requestId}/record`,
    consultations: "/hospital/consultations",
    consultationsOn: (dateKey: string) => `/hospital/consultations?${CONSULTATION_DATE_QUERY_KEY}=${dateKey}`,
    patientDetail: (patientId: string) => `/hospital/patients/${patientId}`,
    carePlanNew: (patientId: string) => `/hospital/patients/${patientId}/care-plan/new`,
    carePlanHistory: (patientId: string) => `/hospital/patients/${patientId}/care-plan/history`,
    monitoring: (patientId: string) => `/hospital/patients/${patientId}/monitoring`,
    monitoringMetric: (patientId: string, metric: string) => `/hospital/patients/${patientId}/monitoring/${metric}`,
  },
  patient: {
    landing: "/patient",
    login: "/patient/login",
    today: "/patient/today",
    carePlan: "/patient/care-plan",
    carePlanItem: (itemId: string) => `?${ITEM_QUERY_KEY}=${itemId}`,
    companion: "/patient/companion",
    doctors: "/patient/doctors",
    doctorDetail: (doctorId: string) => `/patient/doctors/${doctorId}`,
    profile: "/patient/profile",
    activity: "/patient/profile?tab=aktivitas",
    activityMetric: (metric: string) => `/patient/profile/${metric}`,
  },
} as const
