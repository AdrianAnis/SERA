import type { AvailabilityDay, Consultation, Weekday } from "@/features/consultation/types"
import { daysFromToday } from "@/lib/date"
import { DEMO_DOCTOR_ID } from "@/mocks/patients"

const UNTOUCHED = { cancelReason: null, cancelledAt: null, reconfirmedAt: null } as const

export const mockConsultations: Consultation[] = [
  {
    id: "cons-001",
    patientId: "p-001",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(0, "10:00"),
    durationMinutes: 30,
    topic: "Kontrol tekanan darah dan evaluasi dosis amlodipin",
    status: "scheduled",
    ...UNTOUCHED,
  },
  {
    id: "cons-002",
    patientId: "p-002",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(0, "13:30"),
    durationMinutes: 30,
    topic: "Evaluasi keluhan mual setelah minum metformin",
    status: "scheduled",
    ...UNTOUCHED,
  },
  {
    id: "cons-003",
    patientId: "p-003",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(1, "09:30"),
    durationMinutes: 20,
    topic: "Kontrol luka operasi dan evaluasi nyeri",
    status: "scheduled",
    ...UNTOUCHED,
  },
  {
    id: "cons-004",
    patientId: "p-001",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(2, "14:00"),
    durationMinutes: 30,
    topic: "Tinjau hasil pemantauan tekanan darah di rumah",
    status: "cancelled",
    cancelReason: "Dokter berhalangan hadir karena tugas luar.",
    cancelledAt: daysFromToday(-1, "16:00"),
    reconfirmedAt: null,
  },
  {
    id: "cons-008",
    patientId: "p-003",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(1, "17:00"),
    durationMinutes: 20,
    topic: "Konsultasi tambahan keluhan nyeri pada luka operasi",
    status: "scheduled",
    ...UNTOUCHED,
  },
  {
    id: "cons-005",
    patientId: "p-002",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(5, "11:00"),
    durationMinutes: 30,
    topic: "Cek HbA1c dan gula darah puasa",
    status: "scheduled",
    ...UNTOUCHED,
  },
  {
    id: "cons-006",
    patientId: "p-003",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(-3, "09:00"),
    durationMinutes: 20,
    topic: "Pemeriksaan awal pasca operasi usus buntu",
    status: "completed",
    ...UNTOUCHED,
  },
  {
    id: "cons-007",
    patientId: "p-002",
    doctorId: DEMO_DOCTOR_ID,
    startsAt: daysFromToday(-5, "10:30"),
    durationMinutes: 30,
    topic: "Penyesuaian pola makan dan jadwal metformin",
    status: "completed",
    ...UNTOUCHED,
  },
]

const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6]

export const mockAvailability: AvailabilityDay[] = WEEKDAYS.map((weekday) => ({
  id: `avail-${DEMO_DOCTOR_ID}-${weekday}`,
  doctorId: DEMO_DOCTOR_ID,
  weekday,
  isActive: weekday !== 0,
  startTime: "09:00",
  endTime: weekday === 6 ? "12:00" : "16:00",
}))
