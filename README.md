# LearnSpace+ by StudyHack

Learning-management and administration system for a tutoring centre (bimbel): public landing page plus three portals — **admin**, **guru** (tutor) and **siswa** (student).

## Stack

| Part | Technology |
|---|---|
| Front end | React 18, Vite 6, Tailwind 4, react-router, zustand (`src/`) |
| API | Laravel 12, Sanctum bearer tokens (`backend/`) |
| Database | MySQL 8 / MariaDB 10.6+ (SQLite for tests) |
| Hosting | Hostinger shared hosting (PHP 8.2+) |

The SPA talks to the API under `/api`. Almost every list is a "resource" declared once in `backend/config/resources.php`; that file drives the migration, validation, access control and `docs/04-DATABASE-SCHEMA.md`.

## Requirements

PHP 8.2+, Composer 2, Node 20+, MySQL / MariaDB (or SQLite for local work).

## Install and run locally

```bash
# API
cd backend
composer install
cp .env.example .env          # set APP_ENV=local, APP_DEBUG=true and your DB_* (or DB_CONNECTION=sqlite)
php artisan key:generate
php artisan migrate --seed    # creates the tables, three starter accounts and demo content
php artisan serve             # http://127.0.0.1:8000

# SPA (second terminal, repo root)
npm install
npm run dev                   # http://localhost:3001 — /api is proxied to :8000
```

Starter accounts (password = `SEED_PASSWORD`, default `LearnSpace#2026` — change it):

| Role | Email |
|---|---|
| Admin | `admin@studyhack.id` |
| Tutor | `budi.santoso@studyhack.id` |
| Student | `andi.pratama@email.com` |

Students can also self-register on the login page; tutor and admin accounts are created by the operator.

## Tests

```bash
cd backend && php artisan test                      # 128 feature tests, in-memory SQLite
node scripts/e2e.mjs http://127.0.0.1:3001          # browser pass: real login per role, every page
npm run lint                                        # TypeScript check
```

To run the PHP suite against MySQL, export `DB_CONNECTION=mysql DB_HOST=… DB_DATABASE=<scratch db> DB_USERNAME=… DB_PASSWORD=…` before `php artisan test`.

## Deployment

`bash scripts/deploy-hostinger.sh` — see `DEPLOY_HOSTINGER.md` for the one-time server setup.

## Documentation

`TASKS.md` (status), `docs/00`–`10` (audit, functional spec, feature matrix, flows, schema, API map, business rules, authorization, test plan, acceptance criteria, deployment).

## Adding a new list

1. Add an entry to `backend/config/resources.php` and a migration that creates the table (or, before first release, re-run `migrate:fresh`).
2. Use `useCrud('<name>', …)` or `useResource('<name>')` in the page.
3. `php artisan docs:schema > ../docs/04-DATABASE-SCHEMA.md`.
