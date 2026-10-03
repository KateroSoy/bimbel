# 08 — Test Plan

Runner: PHPUnit (`php artisan test`) on in-memory SQLite; the same suite is run once against MariaDB/MySQL before release. Each write test asserts the database row.

| ID | Feature | Precondition | Action | Expected |
|---|---|---|---|---|
| AUTH-01 | Login | active user | POST login, right password | 200, token, user |
| AUTH-02 | Login | user | wrong password | 422, no token |
| AUTH-03 | Login | inactive user | login | 422 |
| AUTH-04 | Login throttle | — | 6 bad attempts | 429 |
| AUTH-05 | Logout | token | POST logout | token deleted, `/me` → 401 |
| AUTH-06 | Register | — | valid payload | user(role siswa) + student row; duplicate email → 422 |
| AUTH-07 | Forgot / reset | user | request link, reset with token | password changed, old password fails |
| AUTH-08 | Change password | token | wrong current → 422; right → hash updated |
| AUTH-09 | Profile | token | PUT /me | row updated; duplicate email → 422 |
| AUTHZ-01 | Guest | — | any protected route | 401 |
| AUTHZ-02 | Role | siswa / guru | admin-only resource and dashboard | 403 |
| AUTHZ-03 | Ownership | two students | list submissions / bills | only own rows |
| AUTHZ-04 | Ownership | two tutors | list / update conversations | only own; other → 404 |
| AUTHZ-05 | Unknown resource | — | `/r/nope` | 404 |
| RES-01..N | Every resource | admin or owner | create → list → update → delete | DB row created / changed / removed (data-provider over the registry) |
| RES-V1 | Validation | — | missing required field, wrong type | 422 |
| RES-V2 | Mass assignment | — | send `id`, `owner_id`, unknown keys | ignored |
| SCH-01 | Schedule clash | existing slot | same tutor or room, same day + slot | 422 |
| BILL-01 | Bill status | — | paid 0 / partial / full | Terlambat / Belum Lunas / Lunas |
| BILL-02 | Student pay | own bill | POST pay | verification = pending; other student's bill → 404 |
| CRS-01 | Course tree | tutor | create module, lesson; update; delete | rows + cascade |
| ENR-01 | Enrollment | admin | enroll twice | one row |
| PRG-01 | Progress | enrolled | complete lesson | lesson_progress row; percent correct; idempotent |
| PRG-02 | Progress | not enrolled / unpublished | complete lesson | 403 |
| QUIZ-01 | Scoring | PG assignment | student submits answers | score computed server-side, stored; client score ignored |
| QUIZ-02 | Keys hidden | siswa | GET assignments / portal | no `answer` field |
| QUIZ-03 | Re-submit | existing submission | submit again | still one row |
| QUIZ-04 | Grade | guru | update score 0–100 | saved; siswa attempt → 403; 101 → 422 |
| PORT-01 | Student portal | seeded student | GET portal | own profile, courses with `done`, bills, attendance |
| DASH-01 | Admin dashboard | seeded | GET | counts equal table counts |
| SET-01 | Settings | — | siswa PUT → 403; admin PUT → saved |
| SEED-01 | Seeder | fresh DB | migrate --seed | admin, tutor, student accounts and demo rows exist |
