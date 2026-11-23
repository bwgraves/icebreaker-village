#!/usr/bin/env bash
# Publish patches/_draft/patch.js as the next free numbered patch on the
# current session branch. If someone else grabs that number at the same
# moment, it automatically retries with the next one.
#
# Usage:  bash scripts/move-in.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

DRAFT=patches/_draft/patch.js
if [ ! -f "$DRAFT" ]; then
  echo "No $DRAFT found. Copy patches/_template/patch.js there and edit it first."
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
case "$branch" in
  main|master|HEAD)
    echo "You're on '$branch'. Check out the session branch first. Remote branches:"
    git branch -r | grep -v HEAD | sed 's|^ *origin/|  |'
    exit 1 ;;
esac

if command -v node >/dev/null 2>&1; then
  if ! node --check "$DRAFT"; then
    echo "Syntax error in $DRAFT (see above). Fix it and run this again."
    exit 1
  fi
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "There are uncommitted changes outside your draft. Commit or stash them first:"
  git status --short
  exit 1
fi

name=$(sed -n 's/^[[:space:]]*name:[[:space:]]*"\([^"]*\)".*/\1/p' "$DRAFT" | head -1)
name=${name:-Someone}
saved=$(mktemp)
cp "$DRAFT" "$saved"

for attempt in 1 2 3 4 5 6 7 8; do
  git pull -q --rebase origin "$branch"
  n=1
  while [ -e "patches/$(printf %02d "$n")" ]; do n=$((n + 1)); done
  nn=$(printf %02d "$n")
  mkdir -p "patches/$nn"
  cp "$saved" "patches/$nn/patch.js"
  git add "patches/$nn"
  git commit -q -m "$name moves into patch $nn"

  if out=$(git push -q origin "HEAD:$branch" 2>&1); then
    rm -rf patches/_draft "$saved"
    echo "MOVED IN: $name is in patch $nn (patches/$nn/patch.js). Refresh index.html to see it."
    exit 0
  fi

  git reset -q --hard HEAD~1   # undo only our own claim commit; the draft is untouched
  if echo "$out" | grep -qiE "403|denied|permission|authenticat|not found"; then
    echo "$out"
    echo "PUSH NOT ALLOWED: ask the host to add you as a collaborator on the repo, accept the invite, then run this again."
    exit 1
  fi
  echo "Someone moved in at the same time. Trying the next plot (attempt $attempt)..."
done

echo "Couldn't push after several tries:"
echo "$out"
exit 1
