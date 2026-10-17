# LearnSpace Production Tasks

Legend: `[ ]` not started · `[-]` in progress · `[x]` completed · `[!]` blocked

## P0 — Foundation
- [x] T001 Audit repository and live app (`docs/00-PROJECT-AUDIT.md`)
- [x] T002 Feature matrix, flows, rules, authorization, test plan (`docs/01`–`09`)
- [x] T003 Scaffold Laravel 12 + Sanctum in `backend/`
- [x] T004 Export former front-end demo data to seed JSON (`backend/database/seeders/data`)
- [x] T005 Resource registry (`config/resources.php`) + migrations (55 tables on MariaDB, 16 foreign keys)
- [x] T006 Seeders (admin, tutor, student accounts + demo rows; idempotent)
- [x] T007 Test database config (SQLite in-memory) + MariaDB run

## P1 — Authentication
- [x] T010 Login / logout / me API + throttle
- [x] T011 Register, forgot / reset password, change password, profile API
- [x] T012 Login UI (email + password, register, forgot, reset), token storage, per-role route guards
- [x] T013 Auth tests (AUTH-01..09)

## P1 — Resource API (admin + tutor lists)
- [x] T020 Generic `ResourceController` (list / create / update / delete, search, filters, access, owner scope)
- [x] T021 Hooks: schedule clash, bill status, submission scoring, id generation
- [x] T022 Resource + authorization tests (RES-*, AUTHZ-*, SCH-01, BILL-01)
- [x] T023 Front-end `api` client + `useResource` + API-backed `useCrud`
- [x] T024 Admin pages (19) read and write through the API
- [x] T025 Tutor pages (15) read and write through the API

## P1 — Learning (student)
- [x] T030 Course / module / lesson / enrollment / progress tables + API
- [x] T031 Student portal payload endpoint
- [x] T032 Lesson complete, bill pay endpoints
- [x] T033 Assignment submit with server-side scoring; grading
- [x] T034 Student pages on the portal payload + API-backed data store
- [x] T035 Learning / quiz / portal tests (CRS, ENR, PRG, QUIZ, PORT)

## P2 — Dashboards, settings, legacy pages
- [x] T040 Admin dashboard endpoint; dashboard numbers and sidebar badges from the database
- [x] T041 Settings API + Pengaturan Lembaga
- [x] T042 Inventaris, WA log, alumni, announcements on the API
- [x] T043 Demo data removed from the front-end bundle (`src/data/*` now hold types only)
- [x] T044 `/admin/laporan*` (5 report menus) now use live aggregate queries and CSV export
- [x] T045 Admin/tutor course editor for courses, modules, and lessons; admin enrollment; browser creation-to-student check

## P2 — Verification
- [x] T050 Full test suite green on SQLite (130 tests)
- [x] T051 Full test suite + `migrate:fresh --seed` on MariaDB 11.4
- [x] T052 Browser pass (`scripts/e2e.mjs`): guards, real login per role, all routed core pages on desktop and phone widths, a UI write surviving reload
- [-] T053 UI regression: mobile overflow checks passed and report screen visually inspected; not compared page by page against reference art

## P2 — Production
- [x] T060 `.env.example`, `DEPLOY_HOSTINGER.md`, `docs/10-DEPLOYMENT.md`, README
- [x] T061 Deploy script: API + SPA + `/api` rewrite (front controller verified locally)
- [ ] T062 Deploy to Hostinger — intentionally deferred by request; later requires a MySQL database + user in hPanel and a server `.env`
- [x] T063 `docs/04-DATABASE-SCHEMA.md` generated from the registry (`php artisan docs:schema`)

## P3 — Optional / external
- [ ] T070 Real AI provider for "AI Pembuat Bahan Ajar" (drafts are template-based and stored)
- [ ] T071 WhatsApp gateway for parent notifications (messages are logged, not sent)
- [x] T072 Assignment files stored privately, validated, and downloaded through the authenticated API
- [!] T073 Mail provider credentials for reset links in production
- [ ] T074 Dates are stored as display strings; move to DATE columns when reporting needs ranges
- [ ] T075 Remove unrouted legacy pages (`ManajemenGuru`, `ManajemenKeuangan`, `AbsensiKelasGuru`, …)

## Revisi Tahap 2 (client feedback in `FEEDBACK_TAHAP2/`, 2026-10-17)
- [x] R201 Landing: official contact (0812-8591-7614, help.studyhack@gmail.com, Medan address), hero copy, promo "Bawa Teman", hero stats removed
- [x] R202 Landing: programs regrouped (Early Childhood / Kids / Creativity / Specialization), `/program/:slug` detail page with sign-up form
- [x] R203 Website sign-up → `POST /api/public/registrations` (throttled, honeypot) → Admin Pendaftaran + notification
- [x] R204 Landing: monthly bundles (Essential / Plus / Comprehensive), Kursus per Materi filters (Jenjang / Pelajaran / Topik)
- [x] R205 Landing: Lynk products link, consultation chatbox, gallery photos 4:3, Google reviews + school-logo slideshow, Instagram/TikTok, "Download Aplikasi", footer "Link Cepat" removed
- [x] R206 Admin: monospace font removed, Tes Kemampuan Dasar (Matematika, Logika & Coding SD) replaces CBT, Alumni page, WhatsApp inbox with per-class batch send, Template Pesan menu removed
- [x] R207 Admin Pengaturan Lembaga: bank accounts, e-wallets, app download link
- [x] R208 Siswa: menu renames (Jadwal Kelas, Kursus & Materi, Latihan dan Tugas), Tatap Muka / Online labels, one-screen layouts, multi-line grade chart
- [x] R209 Siswa: rapor and attendance recap download as PDF on the StudyHack letterhead (jsPDF)
- [x] R210 Siswa: Transfer Bank shows account numbers, E-Wallet replaces Virtual Account, card payment disabled
- [x] R211 Tutor: Jadwal Mengajar (weekly view like the student schedule) replaces Kelas Saya + old schedule; Tatap Muka → presensi, Online → Google Meet
- [x] R212 Tutor: Materi & Modul edits student course content (video, penjelasan, contoh soal, soal latihan, lampiran); only admin creates/deletes courses
- [x] R213 Tutor: Rekap Nilai in Tugas & Assessment (Buku Nilai page removed), per-student grade input in Nilai & Progress, Bank Soal folders, Pesan limited to own students/admin/tutors
- [ ] R214 AI Pembuat Bahan Ajar with a real AI provider (needs provider + API key; see T070)
- [ ] R215 Laporan revisions (client: "menyusul"), Threads / YouTube links (client: "menyusul")
