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
- [ ] T044 `/admin/laporan*` (5 legacy report menus) still render the old static charts — needs real report queries
- [ ] T045 Enrollment / module / lesson management has API + tests but no admin screen (no approved UI for it)

## P2 — Verification
- [x] T050 Full test suite green on SQLite (128 tests)
- [x] T051 Full test suite + `migrate:fresh --seed` on MariaDB 11.4
- [x] T052 Browser pass (`scripts/e2e.mjs`): guards, real login per role, all 57 role pages, a UI write surviving reload
- [-] T053 UI regression: spot-checked login, admin dashboard, student dashboard; not compared page by page

## P2 — Production
- [x] T060 `.env.example`, `DEPLOY_HOSTINGER.md`, `docs/10-DEPLOYMENT.md`, README
- [x] T061 Deploy script: API + SPA + `/api` rewrite (front controller verified locally)
- [!] T062 Deploy to Hostinger — needs a MySQL database + user created in hPanel and a server `.env`
- [x] T063 `docs/04-DATABASE-SCHEMA.md` generated from the registry (`php artisan docs:schema`)

## P3 — Optional / external
- [ ] T070 Real AI provider for "AI Pembuat Bahan Ajar" (drafts are template-based and stored)
- [ ] T071 WhatsApp gateway for parent notifications (messages are logged, not sent)
- [ ] T072 File uploads for assignment submissions (only the file name is stored)
- [!] T073 Mail provider credentials for reset links in production
- [ ] T074 Dates are stored as display strings; move to DATE columns when reporting needs ranges
- [ ] T075 Remove unrouted legacy pages (`ManajemenGuru`, `ManajemenKeuangan`, `AbsensiKelasGuru`, …)
