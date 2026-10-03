# 02 — Feature Matrix

Status is tracked in `TASKS.md`. "Resource API" = generic `ResourceController` driven by `backend/config/resources.php`.

| Feature | Current UI | Backend | DB | Priority |
|---|---|---|---|---|
| Login / logout / me | LoginPage | AuthController | users, tokens | P0 |
| Route guard per role | App routes | role checks | — | P0 |
| Register, forgot / reset, change password, profile | LoginPage, Profil, Pengaturan | AuthController | users, password_reset_tokens | P1 |
| Admin: siswa, pendaftaran, ortu, tutor & staff | 4 pages | Resource API | students, registrations, guardians, staff | P1 |
| Admin: jadwal tutor / kelas, kehadiran, beban | 4 pages | Resource API + clash rule | schedules, tutor_attendances, workloads | P1 |
| Admin: program, kelas & rombel, ruang | 3 pages | Resource API | programs, class_levels, rombels, rooms | P1 |
| Admin: SPP, pembayaran, piutang, pengeluaran, honor | 5 pages | Resource API + bill status | bills, payments, debts, expenses, honors | P1 |
| Admin: dashboard, notifikasi, laporan keuangan | 3 pages | DashboardController, Resource API | aggregates | P2 |
| Admin: inventaris, WA log, pengaturan lembaga | legacy pages | Resource API, SettingsController | inventory_items, whatsapp_logs, settings | P2 |
| Tutor: kelas, jadwal, materi & modul | 3 pages | Resource API | tutor_classes, teach_sessions, materials, modules | P1 |
| Tutor: tugas & penilaian | 2 pages | Resource API + scoring | assignments, submissions | P1 |
| Tutor: presensi, siswa, nilai, perlu perhatian | 4 pages | Resource API | presences, class_students, attention_cases, grades | P1 |
| Tutor: bank soal, pengumuman, pesan, profil | 4 pages | Resource API, AuthController | questions, announcements, conversations, users | P1 |
| Tutor: AI bahan ajar | 1 page | Resource API (stores drafts) | ai_results | P3 — template drafts only, no AI provider |
| Student: dashboard, jadwal, profil | 3 pages | StudentPortalController | students, student_subjects, live_classes | P1 |
| Student: course → lesson → progress | 3 pages | StudentPortalController | courses, course_modules, lessons, course_enrollments, lesson_progress | P1 |
| Student: tugas & quiz | 3 pages | Resource API + scoring | assignments, submissions | P1 |
| Student: hasil belajar, kehadiran, pembayaran | 3 pages | StudentPortalController | student_subjects, student_attendances, bills | P1 |
| WhatsApp sending | KirimWaOrtu | log only | whatsapp_logs | P3 — needs a WA gateway |
| Landing page | LandingPage | static | — | n/a |

## Status (2026-10-03)

Done and tested: every row above marked P0–P2.

Not real yet:
- `/admin/laporan`, `laporan-siswa`, `laporan-kelas`, `laporan-tutor`, `laporan-operasional` — old static report page.
- AI bahan ajar — stores template drafts; no AI provider connected.
- WhatsApp — messages are logged to `whatsapp_logs`, nothing is sent.
- Assignment files — only the file name is saved.
- Reset-password email — needs SMTP settings on the server.
