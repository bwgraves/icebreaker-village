#!/usr/bin/env bash
# Commit and push changes to your own numbered patch (after you've moved in).
#
# Usage:  bash scripts/save.sh "Sam adds a pond"
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
msg=${1:-"Update my patch"}
branch=$(git rev-parse --abbrev-ref HEAD)

changed=$(git status --porcelain -- 'patches/[0-9]*' | awk '{print $NF}')
if [ -z "$changed" ]; then
  echo "Nothing to save."
  exit 0
fi
if command -v node >/dev/null 2>&1; then
  for f in $(git status --porcelain -uall -- 'patches/[0-9]*' | awk '{print $NF}' | grep 'patch\.js$' || true); do
    node --check "$f" || { echo "Syntax error in $f (see above). Fix it and run this again."; exit 1; }
  done
fi

git add -- 'patches/[0-9]*'
git commit -q -m "$msg"
for attempt in 1 2 3 4 5; do
  if git pull -q --rebase origin "$branch" && git push -q origin "HEAD:$branch"; then
    echo "SAVED: pushed \"$msg\". Refresh index.html to see it."
    exit 0
  fi
  sleep 1
done
echo "Couldn't push. If it says permission denied / 403, ask the host to add you as a collaborator."
exit 1
