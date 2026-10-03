#!/usr/bin/env bash
# Build and deploy LearnSpace+ to Hostinger: Laravel API (outside the web root) + SPA (domain root).
# Usage (Git Bash):  bash scripts/deploy-hostinger.sh          # code + migrations
#                    SEED=1 bash scripts/deploy-hostinger.sh   # also run the seeder (first deploy only)
# First deploy: create the MySQL database in hPanel and put a filled-in .env on the server first
# (see DEPLOY_HOSTINGER.md). Override the defaults below through the environment if the hosting changes.
set -euo pipefail

SSH_HOST="${DEPLOY_HOST:-u330327941@46.202.138.60}"
SSH_PORT="${DEPLOY_PORT:-65002}"
SSH_KEY="${DEPLOY_KEY:-$HOME/.ssh/sinarerp_hostinger_codex_ed25519}"
SITE="${DEPLOY_SITE:-powderblue-toad-737211.hostingersite.com}"
REMOTE_DIR="domains/$SITE/public_html"
REMOTE_APP="domains/$SITE/laravel"
SSH=(ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -p "$SSH_PORT" "$SSH_HOST")

cd "$(dirname "$0")/.."

echo "==> Checking the server is ready for the API"
"${SSH[@]}" "test -f ~/$REMOTE_APP/.env" || { echo "Missing ~/$REMOTE_APP/.env on the server. Follow DEPLOY_HOSTINGER.md (database + .env) first."; exit 1; }

echo "==> Running backend tests"
(cd backend && php artisan test --no-ansi | tail -3)

echo "==> Building SPA (base /)"
# Do not pass VITE_BASE=/ here: Git Bash rewrites a bare "/" into a Windows path. The Vite config already defaults to "/".
env -u VITE_BASE -u VITE_API_URL npm run build
grep -q 'src="/assets/index-' dist/index.html || { echo "index.html has unexpected asset paths, aborting"; exit 1; }
[ -f dist/index.html ] && [ -f dist/.htaccess ] && [ -f dist/api/index.php ] || { echo "dist is incomplete, aborting"; exit 1; }
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "==> Backing up current site on server"
"${SSH[@]}" "mkdir -p ~/deploy-backups && tar -czf ~/deploy-backups/bimbel-$STAMP.tgz -C ~/$REMOTE_DIR . && ls -t ~/deploy-backups/bimbel-*.tgz | tail -n +6 | xargs -r rm -f"

echo "==> Uploading API"
tar -C backend --exclude=./vendor --exclude=./.env --exclude=./node_modules --exclude=./tests --exclude='./database/*.sqlite' \
    --exclude='./storage/logs/*.log' --exclude='./storage/framework/cache/data/*' --exclude='./storage/framework/views/*.php' --exclude=./.phpunit.cache -czf - . \
  | "${SSH[@]}" "mkdir -p ~/$REMOTE_APP && tar -xzf - -C ~/$REMOTE_APP"

echo "==> Installing dependencies and migrating"
"${SSH[@]}" "cd ~/$REMOTE_APP && composer install --no-dev --optimize-autoloader --no-interaction --quiet \
  && php artisan migrate --force --no-ansi | tail -3 \
  && { [ '${SEED:-0}' != '1' ] || php artisan db:seed --force --no-ansi | tail -2; } \
  && php artisan config:cache --no-ansi | tail -1 && php artisan route:cache --no-ansi | tail -1 \
  && chmod -R ug+rwX storage bootstrap/cache"

echo "==> Uploading SPA"
tar -C dist -czf - . | "${SSH[@]}" "tar -xzf - -C ~/$REMOTE_DIR"

# Old hashed bundles are no longer referenced once index.html is replaced
KEEP="$(cd dist/assets && ls index-*.js index-*.css | tr '\n' ' ')"
echo "==> Removing stale bundles (keeping: $KEEP)"
"${SSH[@]}" "cd ~/$REMOTE_DIR/assets && for f in index-*.js index-*.css; do case \" $KEEP \" in *\" \$f \"*) ;; *) rm -f \"\$f\";; esac; done; ls index-*"

echo "==> Verifying"
LIVE="$(curl -fsS "https://$SITE/" | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1)"
LOCAL="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' dist/index.html | head -1)"
API="$(curl -s -o /dev/null -w '%{http_code}' -H 'Accept: application/json' "https://$SITE/api/me")"
if [ "$LIVE" = "$LOCAL" ] && [ "$API" = "401" ]; then
  echo "Deployed: https://$SITE/ serves $LIVE, API answers (backup: ~/deploy-backups/bimbel-$STAMP.tgz)"
else
  echo "WARNING: live bundle '$LIVE' (expected '$LOCAL'), /api/me returned $API (expected 401)"; exit 1
fi
