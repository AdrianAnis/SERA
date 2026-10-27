import { OUT_OF_SCOPE_MESSAGE } from "@/features/companion/scenarios"
import type { ChatMessage, QuestionScope } from "@/features/companion/types"
import { daysFromToday, formatDate } from "@/lib/date"

type SeededExchange = {
  daysAgo: number
  time: string
  question: string
  scope: QuestionScope
  answer: string
}

function buildThread(patientId: string, exchanges: SeededExchange[]): ChatMessage[] {
  return exchanges.flatMap((exchange, index) => {
    const createdAt = daysFromToday(-exchange.daysAgo, exchange.time)
    const base = { createdAt, scope: exchange.scope, source: null, isReported: false }
    return [
      { ...base, id: `msg-seed-${patientId}-q${index + 1}`, role: "patient", content: exchange.question },
      { ...base, id: `msg-seed-${patientId}-a${index + 1}`, role: "companion", content: exchange.answer },
    ]
  })
}

export const mockCompanionThreads: Record<string, ChatMessage[]> = {
  "p-001": buildThread("p-001", [
    { daysAgo: 6, time: "07:50", question: "Amlodipin diminum jam berapa?", scope: "in-scope", answer: "Amlodipin 5 mg diminum sekali sehari pukul 07:00, setelah sarapan." },
    {
      daysAgo: 5,
      time: "12:20",
      question: "Boleh makan ikan asin sesekali?",
      scope: "in-scope",
      answer: "Ikan asin termasuk makanan awetan yang perlu dihindari menurut care plan Anda.",
    },
    { daysAgo: 3, time: "19:40", question: "Kepala saya pusing ringan tiap pagi, apa itu normal?", scope: "out-of-scope", answer: OUT_OF_SCOPE_MESSAGE },
    { daysAgo: 2, time: "06:30", question: "Hari ini jalan kaki berapa lama?", scope: "in-scope", answer: "Jalan kaki pagi dilakukan 30 menit, lima kali seminggu." },
    {
      daysAgo: 1,
      time: "21:05",
      question: "Kapan jadwal kontrol berikutnya?",
      scope: "in-scope",
      answer: `Kontrol berikutnya pada ${formatDate(daysFromToday(10), "EEEE, d MMMM yyyy")}.`,
    },
  ]),
  "p-002": buildThread("p-002", [
    { daysAgo: 6, time: "07:05", question: "Metformin diminum bareng makan ya?", scope: "in-scope", answer: "Ya, metformin 500 mg diminum bersama makan, tiga kali sehari." },
    {
      daysAgo: 5,
      time: "13:40",
      question: "Boleh minum teh manis?",
      scope: "in-scope",
      answer: "Teh manis termasuk minuman manis yang perlu dihindari menurut care plan Anda.",
    },
    { daysAgo: 4, time: "08:10", question: "Saya mual dan perut perih setelah minum metformin, kenapa ya?", scope: "out-of-scope", answer: OUT_OF_SCOPE_MESSAGE },
    { daysAgo: 2, time: "16:45", question: "Jalan kaki sore sebaiknya berapa menit?", scope: "in-scope", answer: "Jalan kaki sore dilakukan 30 menit, lima kali seminggu." },
    {
      daysAgo: 1,
      time: "21:00",
      question: "Kapan saya harus cek HbA1c lagi?",
      scope: "in-scope",
      answer: `Pemeriksaan HbA1c dan gula darah puasa dijadwalkan pada ${formatDate(daysFromToday(10), "EEEE, d MMMM yyyy")}.`,
    },
  ]),
  "p-003": buildThread("p-003", [
    {
      daysAgo: 2,
      time: "09:00",
      question: "Parasetamol diminum berapa kali sehari?",
      scope: "in-scope",
      answer: "Parasetamol 500 mg diminum tiga kali sehari pada pukul 07:00, 13:00, dan 19:00.",
    },
    { daysAgo: 1, time: "20:10", question: "Boleh minum jamu atau suplemen herbal biar lukanya cepat sembuh?", scope: "out-of-scope", answer: OUT_OF_SCOPE_MESSAGE },
  ]),
}
