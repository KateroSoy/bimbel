# 01 — Functional Spec

Roles: **admin**, **guru** (tutor), **siswa** (student). The UI is frozen; the SPA talks to a Laravel JSON API under `/api`.

## MODULE: Authentication
- Features: login (email + password), logout, register (student), forgot / reset password, change password, profile update, `me`.
- DB: `users`, `personal_access_tokens`, `password_reset_tokens`.
- Rules: bcrypt hashes; inactive users rejected; login throttled (5 per minute per email + IP); Sanctum bearer token.
- Failure: 422 with field errors, 401 unauthenticated, 403 wrong role.

## MODULE: Resource data (admin and tutor lists)
- Purpose: every list page (students, registrations, guardians, staff, schedules, rooms, bills, payments, …) reads and writes MySQL.
- API: `GET/POST /api/r/{resource}`, `PUT/DELETE /api/r/{resource}/{id}`; search `?q=`, exact filters `?filter[col]=`.
- Validation: per-resource rules in `config/resources.php`; unknown fields are dropped.
- Permission: per-resource read / write roles; owner scoping for tutor-owned and student-owned rows.
- Hooks: schedule clash rejection, bill status derived from amounts, ids generated server-side.

## MODULE: Courses and learning (student)
- Course → Module → Lesson (relational). A student sees only enrolled, published courses.
- `POST /api/student/lessons/{id}/complete` writes `lesson_progress`; course percent = completed ÷ total lessons.
- Tutor / admin manage courses, modules and lessons.

## MODULE: Assignments and quiz
- Tutor creates an assignment or quiz, optionally with questions. One submission per student per assignment (re-submit replaces).
- Multiple-choice score is computed on the server from stored answer keys; keys are never sent to students.
- Tutor grades other submissions (0–100) with feedback.

## MODULE: Attendance, bills, announcements, messages
- Student reads own attendance and bills; `POST /api/student/bills/{id}/pay` sets *Menunggu Verifikasi*; admin confirms by recording the payment.
- Announcements: readable by all roles, written by admin / tutor. Tutor conversations are private to the tutor.

## MODULE: Dashboards
- `GET /api/admin/dashboard` returns counts and sums computed from tables. Tutor and student dashboards derive from their own data.

## MODULE: Settings
- `GET /api/settings` (all roles), `PUT /api/settings` (admin).
