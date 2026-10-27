import type { CarePlan } from "@/features/care-plan/types"
import { daysFromToday, toDateKey } from "@/lib/date"
import { DEMO_DOCTOR_ID } from "@/mocks/patients"

export const mockCarePlans: CarePlan[] = [
  {
    id: "cp-p-001-v1",
    patientId: "p-001",
    version: 1,
    status: "superseded",
    sourceText: "Hipertensi baru terdiagnosis. Mulai amlodipin, batasi garam, rutin jalan kaki.",
    createdBy: DEMO_DOCTOR_ID,
    createdAt: daysFromToday(-91, "10:00"),
    confirmedAt: daysFromToday(-90, "09:00"),
    items: [
      { id: "cp-p-001-v1-m1", kind: "medication", drug: "Amlodipin", dose: "5 mg", times: ["07:00"], durationDays: 60, instruction: "Diminum setelah sarapan.", aiSuggested: false },
      { id: "cp-p-001-v1-d1", kind: "diet", category: "Garam", rule: "limit", instruction: "Maksimal 1 sendok teh garam per hari.", aiSuggested: false },
      { id: "cp-p-001-v1-a1", kind: "activity", activity: "Jalan kaki pagi", frequencyPerWeek: 3, durationMinutes: 20, instruction: "Jalan santai di pagi hari.", aiSuggested: false },
    ],
  },
  {
    id: "cp-p-001-v2",
    patientId: "p-001",
    version: 2,
    status: "active",
    sourceText: "Lanjutkan amlodipin 5 mg pagi. Hindari ikan asin dan makanan awetan. Jalan kaki 30 menit 5x seminggu. Kontrol 2 minggu lagi.",
    createdBy: DEMO_DOCTOR_ID,
    createdAt: daysFromToday(-31, "09:30"),
    confirmedAt: daysFromToday(-30, "09:45"),
    items: [
      { id: "cp-p-001-v2-m1", kind: "medication", drug: "Amlodipin", dose: "5 mg", times: ["07:00"], durationDays: 90, instruction: "Diminum setelah sarapan.", aiSuggested: false },
      { id: "cp-p-001-v2-d1", kind: "diet", category: "Garam", rule: "limit", instruction: "Maksimal 1 sendok teh garam per hari, termasuk kecap dan saus.", aiSuggested: false },
      { id: "cp-p-001-v2-d2", kind: "diet", category: "Makanan awetan", rule: "avoid", instruction: "Ikan asin, mi instan, kerupuk, sosis, dan kornet.", aiSuggested: false },
      { id: "cp-p-001-v2-d3", kind: "diet", category: "Sayur dan buah", rule: "recommend", instruction: "Bayam, pisang, dan pepaya untuk asupan kalium.", aiSuggested: false },
      { id: "cp-p-001-v2-a1", kind: "activity", activity: "Jalan kaki pagi", frequencyPerWeek: 5, durationMinutes: 30, instruction: "Hentikan bila pusing, berdebar, atau nyeri dada.", aiSuggested: false },
      { id: "cp-p-001-v2-r1", kind: "restriction", subject: "Merokok", durationDays: null, instruction: "Berhenti merokok selama masa pengobatan.", aiSuggested: false },
      { id: "cp-p-001-v2-f1", kind: "followUp", date: toDateKey(daysFromToday(10)), instruction: "Kontrol tekanan darah dan evaluasi dosis.", aiSuggested: false },
    ],
  },
  {
    id: "cp-p-002-v1",
    patientId: "p-002",
    version: 1,
    status: "active",
    sourceText: "Metformin 3x sehari bersama makan, glimepirid sebelum sarapan. Hindari minuman manis. Jalan kaki sore. Cek HbA1c 10 hari lagi.",
    createdBy: DEMO_DOCTOR_ID,
    createdAt: daysFromToday(-45, "08:40"),
    confirmedAt: daysFromToday(-45, "09:00"),
    items: [
      { id: "cp-p-002-v1-m1", kind: "medication", drug: "Metformin", dose: "500 mg", times: ["07:00", "13:00", "19:00"], durationDays: 90, instruction: "Diminum bersama makan.", aiSuggested: false },
      { id: "cp-p-002-v1-m2", kind: "medication", drug: "Glimepirid", dose: "2 mg", times: ["06:30"], durationDays: 90, instruction: "Diminum 15 menit sebelum sarapan.", aiSuggested: false },
      { id: "cp-p-002-v1-d1", kind: "diet", category: "Minuman manis", rule: "avoid", instruction: "Teh manis, es jeruk, sirup, dan kopi susu gula aren.", aiSuggested: false },
      { id: "cp-p-002-v1-d2", kind: "diet", category: "Nasi putih", rule: "limit", instruction: "Maksimal 1 centong per kali makan.", aiSuggested: false },
      { id: "cp-p-002-v1-d3", kind: "diet", category: "Sayuran hijau", rule: "recommend", instruction: "Isi setengah piring dengan sayur setiap makan.", aiSuggested: false },
      { id: "cp-p-002-v1-a1", kind: "activity", activity: "Jalan kaki sore", frequencyPerWeek: 5, durationMinutes: 30, instruction: "Bawa permen, berhenti bila gemetar atau berkeringat dingin.", aiSuggested: false },
      { id: "cp-p-002-v1-f1", kind: "followUp", date: toDateKey(daysFromToday(10)), instruction: "Cek HbA1c dan gula darah puasa.", aiSuggested: false },
    ],
  },
  {
    id: "cp-p-003-v1",
    patientId: "p-003",
    version: 1,
    status: "active",
    sourceText: "Pemulihan pasca operasi usus buntu. Parasetamol 3x sehari selama 14 hari. Jangan angkat beban. Kontrol luka dalam 2 minggu.",
    createdBy: DEMO_DOCTOR_ID,
    createdAt: daysFromToday(-9, "10:30"),
    confirmedAt: daysFromToday(-9, "10:45"),
    items: [
      { id: "cp-p-003-v1-m1", kind: "medication", drug: "Parasetamol", dose: "500 mg", times: ["07:00", "13:00", "19:00"], durationDays: 14, instruction: "Diminum setelah makan, boleh dilewati bila tidak nyeri.", aiSuggested: false },
      { id: "cp-p-003-v1-d1", kind: "diet", category: "Protein", rule: "recommend", instruction: "Telur, ikan, tempe, dan tahu untuk penyembuhan luka.", aiSuggested: false },
      { id: "cp-p-003-v1-d2", kind: "diet", category: "Makanan pedas dan berminyak", rule: "avoid", instruction: "Sambal, gorengan, dan makanan bersantan kental.", aiSuggested: false },
      { id: "cp-p-003-v1-a1", kind: "activity", activity: "Jalan kaki santai", frequencyPerWeek: 7, durationMinutes: 15, instruction: "Jalan pelan di sekitar rumah.", aiSuggested: false },
      { id: "cp-p-003-v1-r1", kind: "restriction", subject: "Angkat beban", durationDays: 30, instruction: "Jangan angkat beban lebih dari 5 kg.", aiSuggested: false },
      { id: "cp-p-003-v1-f1", kind: "followUp", date: toDateKey(daysFromToday(4)), instruction: "Kontrol luka operasi dan evaluasi nyeri.", aiSuggested: false },
    ],
  },
]

export const mockAcknowledgedPlanIds: Record<string, string> = {
  "p-001": "cp-p-001-v2",
  "p-002": "cp-p-002-v1",
  "p-003": "cp-p-003-v1",
}
