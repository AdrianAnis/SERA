export type LandingStep = {
  number: string
  title: string
  text: string
  points: string[]
  photoId: string
  photoAlt: string
}

export type LandingFeature = {
  title: string
  text: string
}

export type LandingQuestion = {
  question: string
  answer: string
}

export const HERO_PHOTO_ID = "photo-1758691463000-08b98131daf3"
export const HERO_PHOTO_ALT = "Dokter menunjukkan hasil pemindaian kepada pasien lewat tablet"

export const LANDING_STEPS: LandingStep[] = [
  {
    number: "01",
    title: "Tulis instruksi seperti biasa",
    text: "Satu kalimat sudah cukup. Obat, makanan, aktivitas, dan jadwal kontrol tersusun menjadi item terstruktur yang bisa Anda ubah per item.",
    points: ["Usulan AI hanya saran dan diberi penanda", "Validasi otomatis sebelum sesi bisa diselesaikan"],
    photoId: "photo-1758691462668-046fd85ceac9",
    photoAlt: "Dokter memeriksa hasil pemindaian di tablet pada meja kerja",
  },
  {
    number: "02",
    title: "Pasien langsung menerimanya",
    text: "Begitu Anda mengonfirmasi, jadwal obat, panduan makanan, dan jawaban Companion di aplikasi pasien berganti ke versi terbaru.",
    points: ["Versi lama otomatis digantikan", "Pasien diberi tahu bahwa care plan diperbarui"],
    photoId: "photo-1666886573517-dee9a64ac615",
    photoAlt: "Tenaga medis memegang tablet saat bekerja",
  },
  {
    number: "03",
    title: "Pantau tanpa menunggu kontrol",
    text: "Lihat jadwal yang ditandai pasien, keluhan yang dilaporkan, dan pertanyaan yang tidak bisa dijawab Companion dalam satu dashboard.",
    points: ["Data perilaku, bukan penilaian kesembuhan", "Pertanyaan di luar care plan diteruskan ke Anda"],
    photoId: "photo-1666886573212-2de95596d509",
    photoAlt: "Seorang pria menggunakan tablet",
  },
]

export const LANDING_FEATURES: LandingFeature[] = [
  { title: "Builder terstruktur", text: "Obat, makanan, aktivitas, pembatasan, dan kontrol dalam satu form yang divalidasi." },
  { title: "Usulan AI", text: "Tulis instruksi bebas, biarkan item tersusun, lalu Anda yang menyetujui tiap item." },
  { title: "Ringkasan perubahan", text: "Sebelum sesi diselesaikan, lihat apa yang ditambah, diubah, dan dihapus dibanding versi aktif." },
  { title: "Satu versi aktif", text: "Setiap pasien hanya punya satu care plan aktif. Versi lama tersimpan sebagai riwayat." },
  { title: "Monitoring perilaku", text: "Grafik jadwal yang ditandai pasien dan laporan keluhan, tanpa klaim kesembuhan." },
  { title: "Eskalasi yang jelas", text: "Pertanyaan darurat atau di luar care plan tidak dijawab asal, dan muncul di dashboard Anda." },
]

export const LANDING_QUESTIONS: LandingQuestion[] = [
  {
    question: "Apakah AI memberi diagnosis atau resep?",
    answer: "Tidak. AI hanya menyusun instruksi yang Anda tulis menjadi item terstruktur. Tidak ada yang terkirim ke pasien sebelum Anda menyelesaikan sesi.",
  },
  {
    question: "Apa yang dilihat pasien?",
    answer: "Hanya care plan aktif. Jadwal, panduan makanan, dan jawaban Companion selalu berasal dari versi yang sedang berlaku.",
  },
  {
    question: "Bagaimana kepatuhan pasien ditampilkan?",
    answer: "Sebagai data perilaku, yaitu jadwal yang ditandai selesai. Angka ini tidak dipakai untuk menyimpulkan kesembuhan.",
  },
  {
    question: "Bagaimana jika pasien bertanya di luar care plan?",
    answer: "Companion tidak mengarang jawaban. Ia mengarahkan pasien bertanya ke dokter, dan pertanyaannya muncul di dashboard Anda.",
  },
]
