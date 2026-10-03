# 06 — Business Rules

1. Every API call except login / register / forgot / reset needs a valid token; the role comes from the user row, never from the client.
2. Resource access follows `config/resources.php` (`read`, `write`, `owner`). Hidden buttons are not a control.
3. A student only ever receives their own submissions, bills, attendance, subjects and certificates. Submissions are always saved under the authenticated student.
4. Tutor-owned rows (classes, sessions, materials, modules, presences, attention cases, conversations, AI drafts) are visible to their owner and to admin.
5. One submission per (assignment, student); re-submitting replaces the previous one and resets grading.
6. Multiple-choice assignments are scored on the server: `round(correct / total × 100)`. Answer keys are stripped from student responses. Students cannot set `score`, `status` or `feedback`.
7. Only tutor / admin can grade; score must be 0–100.
8. Course progress = completed lessons ÷ total lessons of the course. Completing a lesson requires enrollment in its course and the course being published.
9. One enrollment per (student, course) — DB unique key.
10. A schedule cannot share day + slot with another entry for the same tutor or the same room.
11. Bill status is derived: paid ≥ amount − discount → `Lunas`; 0 < paid → `Belum Lunas`; else `Terlambat`. A student payment only sets `verification = pending`; admin recording a payment clears it.
12. Public ids (`id` in JSON) are server-generated codes; clients cannot choose them.
13. Deleting a course cascades to its modules, lessons, enrollments and progress.
