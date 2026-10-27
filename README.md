# Sera

Frontend-only prototype. Two surfaces in one Next.js app, all data mocked and persisted in `localStorage`.

- `/hospital`: clinician workspace (desktop, sidebar)
- `/patient`: patient companion (mobile-first, bottom nav)
- `/` redirects to `/patient`

## Run

```bash
pnpm install
pnpm dev
```

## Alur dokter dan pasien

1. Open `/hospital/patients/p-001/care-plan/new` in one tab and `/patient/today` in another.
2. Click **Selesaikan sesi**. The patient tab switches to the new plan version without a reload.

Login dokter dan pasien menerima email dan kata sandi apa saja (email harus berformat valid).
