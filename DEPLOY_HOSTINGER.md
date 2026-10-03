# Deploying to Hostinger

Target: shared hosting with PHP 8.2+ (server has 8.3), MySQL / MariaDB, Composer and SSH.

## Layout on the server

```
~/domains/<site>/laravel/        Laravel API (app, vendor, .env) — outside the web root
~/domains/<site>/public_html/    SPA build (document root)
    .htaccess                    /api/* → api/index.php, everything else → index.html
    api/index.php                boots ../../laravel
```

## One-time setup

1. **Database** — hPanel → Databases → MySQL: create a database and a user, note name / user / password.
2. **.env** — over SSH:
   ```bash
   mkdir -p ~/domains/<site>/laravel && cd ~/domains/<site>/laravel
   nano .env        # copy backend/.env.example and fill in the values below
   ```
   | Key | Value |
   |---|---|
   | `APP_URL`, `FRONTEND_URL` | `https://<site>` |
   | `APP_KEY` | leave empty, then run `php artisan key:generate` after the first upload |
   | `APP_ENV` / `APP_DEBUG` | `production` / `false` |
   | `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | from step 1 (`DB_HOST=127.0.0.1`) |
   | `MAIL_*` | a mailbox created in hPanel (needed for reset-password emails) |
   | `SEED_PASSWORD` | initial password for the three starter accounts |
3. **First deploy** from your machine: `SEED=1 bash scripts/deploy-hostinger.sh`, then on the server run `php artisan key:generate --force && php artisan config:cache` if `APP_KEY` was empty.
4. Log in as `admin@studyhack.id` with `SEED_PASSWORD` and change the passwords.

## Every later deploy

```bash
bash scripts/deploy-hostinger.sh
```

The script runs the backend tests, builds the SPA, backs up `public_html`, uploads the API, runs `composer install --no-dev`, `migrate --force`, `config:cache`, `route:cache`, uploads the SPA and checks the live bundle and `/api/me`.

## Notes

- PHP version: hPanel → Advanced → PHP Configuration → 8.2 or newer; extensions `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `tokenizer`, `xml`, `ctype`.
- Permissions: `storage/` and `bootstrap/cache/` must be writable (the script runs `chmod -R ug+rwX`).
- No cron, queue worker or `storage:link` is needed: the API is stateless and stores no uploaded files.
- Seeder policy: `db:seed` only runs when `SEED=1` and does nothing once any user exists.
- Rollback: `tar -xzf ~/deploy-backups/bimbel-<stamp>.tgz -C ~/domains/<site>/public_html` restores the previous SPA; database changes are forward-only migrations.
- `.env` and `vendor/` are never uploaded from your machine and are not web accessible.
