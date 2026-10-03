# 09 — Acceptance Criteria

Ticked only when implemented and covered by an automated test (`backend/tests`, `scripts/e2e.mjs`). Status as of 2026-10-03: 23 of 25.

**LOGIN**
- [x] valid user can log in; invalid password rejected; inactive user rejected
- [x] token issued; user redirected to their role dashboard
- [x] role pages redirect to login without a token; wrong role is redirected away
- [x] logout revokes the token

**ACCOUNT**
- [x] student can register; duplicate email rejected
- [ ] forgot / reset password works end to end — API and form are tested; sending the email in production needs SMTP credentials
- [x] change password requires the current password
- [x] profile edits persist

**RESOURCES (admin and tutor lists)**
- [x] list, create, update, delete persist to MySQL for every resource
- [x] required fields validated on the server
- [x] unauthorized role gets 403; other owner's row is not reachable

**COURSE / LEARNING**
- [x] tutor / admin can create, update, delete course, module, lesson
- [x] student sees only enrolled published courses
- [x] completing a lesson stores progress; percent derives from it
- [x] duplicate enrollment impossible

**ASSIGNMENT / QUIZ**
- [x] tutor creates; student submits once; PG scored on server; keys never exposed
- [x] tutor grades with feedback; student sees the result

**FINANCE**
- [x] bill status derives from amounts; student pay → pending; admin confirm → Lunas
- [x] payments, debts, expenses, honors persist

**DASHBOARD / SETTINGS**
- [x] admin dashboard numbers come from the database
- [x] settings persist; only admin can write

**PRODUCTION**
- [x] fresh `migrate --seed` works on MySQL / MariaDB
- [ ] `APP_DEBUG=false`, `.env` not web-accessible — configured in `.env.example` and the deploy layout; not yet verified on the server (deploy blocked on database credentials)
- [x] full test suite passes
