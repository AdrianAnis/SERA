export const ITEM_QUERY_KEY = "item"

export const CONSULTATION_DATE_QUERY_KEY = "tanggal"

export const routes = {
  home: "/",
  hospital: {
    landing: "/hospital",
    login: "/hospital/login",
    dashboard: "/hospital/dashboard",
    patientList: "/hospital/patients",
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
    profile: "/patient/profile",
    activity: "/patient/profile?tab=aktivitas",
    activityMetric: (metric: string) => `/patient/profile/${metric}`,
  },
} as const
