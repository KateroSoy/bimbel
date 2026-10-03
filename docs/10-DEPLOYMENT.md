# 10 — Deployment

Production target is Hostinger shared hosting; the step-by-step guide is `DEPLOY_HOSTINGER.md` and the automation is `scripts/deploy-hostinger.sh`.

| Item | Value |
|---|---|
| PHP | 8.2+ (`pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `tokenizer`, `xml`, `ctype`) |
| Database | MySQL 8 / MariaDB 10.6+, InnoDB, utf8mb4 |
| Document root | `public_html/` = SPA build; `/api/*` is rewritten to `api/index.php`, which boots Laravel from `../laravel` |
| Environment | `backend/.env.example` (production defaults: `APP_DEBUG=false`, stateless API, file cache) |
| Build | `npm run build` (SPA), `composer install --no-dev --optimize-autoloader` (API) |
| Migrate | `php artisan migrate --force` on every deploy |
| Seed | `php artisan db:seed --force` once (idempotent; uses `SEED_PASSWORD`) |
| Cache | `php artisan config:cache && php artisan route:cache` |
| Cron / queue / storage link | not required |
| Health checks | `GET /` serves the new bundle; `GET /api/me` without a token returns 401 JSON |

## Local development

```bash
cd backend && composer install && cp .env.example .env   # set APP_ENV=local, DB_CONNECTION=sqlite or mysql
php artisan key:generate && php artisan migrate --seed
php artisan serve                                        # API on :8000
npm install && npm run dev                               # SPA on :3001, proxies /api to :8000
```

## Verification before release

1. `cd backend && php artisan test` — also once with `DB_CONNECTION=mysql` pointing at a scratch database.
2. `node scripts/e2e.mjs http://127.0.0.1:<port>` — logs in as each role through the real form and opens every page.
3. `php artisan docs:schema > ../docs/04-DATABASE-SCHEMA.md` if `config/resources.php` changed.
