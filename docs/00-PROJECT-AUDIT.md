# 00 — Project Audit (2026-10-03)

**CURRENT STACK**
- FRONTEND: React 18 + Vite 6 + Tailwind 4 SPA, react-router, zustand, recharts. Built to `dist/`, PWA.
- BACKEND: none. DATABASE: none (browser `localStorage` + static TS files).
- HOSTING: Hostinger shared (PHP 8.3, MariaDB, Composer, SSH). SPA at domain root with `.htaccess` rewrite.

**WORKING (UI only):** landing, role dashboards, 19 admin pages, 15 tutor pages, 16 student pages; filters, tabs, pagination, dialogs.

**STATIC / MOCKED**
- Login is a role picker (`LoginPage`): no credentials, no session, no route guard.
- `src/data/{adminPortal,guruPortal,siswaPortal}.ts`: hard-coded rows and statistics.
- `src/store/useDataStore.ts`: ~400 lines of seeded demo data persisted to `localStorage`.
- Student id hard-coded as `1001`; quiz scoring done in the browser; payment is a local toggle.
- AI bahan ajar and WhatsApp sending are simulated.

**BROKEN / MISSING:** no auth, no authorization, no cross-device persistence, no server-side validation, no register / forgot password, `/favicon.ico` 404.

**SECURITY ISSUES:** any visitor can open any role; no server checks at all.

**PRODUCTION RISKS:** data loss on browser clear; fake numbers presented as real.

**TECHNICAL DEBT:** unrouted legacy pages (`ManajemenGuru`, `ManajemenKeuangan`, …); dates stored as display strings; single 1.6 MB JS bundle.
