#!/usr/bin/env bash
# Build and deploy the static site to Hostinger (domain root).
# Usage (Git Bash):  bash scripts/deploy-hostinger.sh
# Override any of the defaults below through the environment if the hosting changes.
set -euo pipefail

SSH_HOST="${DEPLOY_HOST:-u330327941@46.202.138.60}"
SSH_PORT="${DEPLOY_PORT:-65002}"
SSH_KEY="${DEPLOY_KEY:-$HOME/.ssh/sinarerp_hostinger_codex_ed25519}"
SITE="${DEPLOY_SITE:-powderblue-toad-737211.hostingersite.com}"
REMOTE_DIR="domains/$SITE/public_html"
SSH=(ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -p "$SSH_PORT" "$SSH_HOST")

cd "$(dirname "$0")/.."

echo "==> Building (base /)"
# Do not pass VITE_BASE=/ here: Git Bash rewrites a bare "/" into a Windows path. The Vite config already defaults to "/".
env -u VITE_BASE npm run build
grep -q 'src="/assets/index-' dist/index.html || { echo "index.html has unexpected asset paths, aborting"; exit 1; }

[ -f dist/index.html ] && [ -f dist/.htaccess ] || { echo "dist is incomplete, aborting"; exit 1; }
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "==> Backing up current site on server"
"${SSH[@]}" "mkdir -p ~/deploy-backups && tar -czf ~/deploy-backups/bimbel-$STAMP.tgz -C ~/$REMOTE_DIR . && ls -t ~/deploy-backups/bimbel-*.tgz | tail -n +6 | xargs -r rm -f"

echo "==> Uploading build"
tar -C dist -czf - . | "${SSH[@]}" "tar -xzf - -C ~/$REMOTE_DIR"

# Old hashed bundles are no longer referenced once index.html is replaced
KEEP="$(cd dist/assets && ls index-*.js index-*.css | tr '\n' ' ')"
echo "==> Removing stale bundles (keeping: $KEEP)"
"${SSH[@]}" "cd ~/$REMOTE_DIR/assets && for f in index-*.js index-*.css; do case \" $KEEP \" in *\" \$f \"*) ;; *) rm -f \"\$f\";; esac; done; ls index-*"

echo "==> Verifying"
LIVE="$(curl -fsS "https://$SITE/" | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1)"
LOCAL="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' dist/index.html | head -1)"
if [ "$LIVE" = "$LOCAL" ]; then
  echo "Deployed: https://$SITE/ serves $LIVE (backup: ~/deploy-backups/bimbel-$STAMP.tgz)"
else
  echo "WARNING: live site serves '$LIVE' but build is '$LOCAL'"; exit 1
fi
