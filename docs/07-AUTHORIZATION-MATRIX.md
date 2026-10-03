# 07 — Authorization Matrix

| Feature | Guest | Siswa | Guru | Admin |
|---|---|---|---|---|
| Landing, login, register, forgot / reset | YES | — | — | — |
| `/api/me`, profile, change password | NO | YES | YES | YES |
| Student portal (`/api/student/*`) | NO | YES (own) | NO | NO |
| Assignments: read | NO | YES (no answer keys) | YES | YES |
| Assignments: write | NO | NO | YES | YES |
| Submissions: create | NO | YES (self) | NO | NO |
| Submissions: read | NO | own | all | all |
| Submissions: grade | NO | NO | YES | YES |
| Courses / modules / lessons: write | NO | NO | YES | YES |
| Announcements: read / write | NO | R | RW | RW |
| Tutor resources (classes, sessions, materials, presences, questions, conversations, …) | NO | NO | own | all |
| Admin resources (students, staff, finance, rooms, schedules, …) | NO | NO | read-only: students, schedules, classrooms | RW |
| Admin dashboard | NO | NO | NO | YES |
| Settings: read / write | NO | R | R | RW |

Enforced by `auth:sanctum`, `ResourceController` access checks and `role:` middleware. Covered by `AuthorizationTest`.
