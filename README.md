# 🏡 Icebreaker Village

A meeting icebreaker where everyone vibe‑codes themselves into an 8‑bit village.

Each person gets a square patch of land, fenced off and with their name on a plate out front. With the help of their AI coding agent, they:

- add their 8‑bit self to the patch and style themselves
- build themselves a house
- zhuzh their back garden
- give their character a thought bubble
- adopt a pet

Everyone pushes to the same branch. Refresh the page and the village grows. Drag around to explore your neighbours.

It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

## For the host

1. Create a branch for the session and push it:
   ```sh
   git checkout main && git pull
   git checkout -b icebreaker/2026-11-23-design-team
   git push -u origin icebreaker/2026-11-23-design-team
   ```
2. Share the repo URL and the branch name with everyone.
3. Open the village and share your screen. Every few minutes, `git pull` and refresh to watch new neighbours move in.
4. Afterwards, leave the branch as a keepsake. **Don't merge session branches into `main`.** `main` should always be an empty village.

Tip: if the repo is on GitHub, you can enable GitHub Pages for the session branch so everyone can see the village at a URL without running anything.

## For participants

1. Clone the repo (if you haven't already), then check out the session branch:
   ```sh
   git fetch origin
   git checkout icebreaker/2026-11-23-design-team
   ```
2. Open your AI coding agent (Claude Code, Codex, Cursor, Copilot, …) in the repo and say:
   > Read AGENTS.md and add me to Icebreaker Village.
3. Answer its questions, then admire your patch.

The agent claims the next free patch, commits and pushes. If two people grab the same patch at the same moment, the second one moves to the next free patch automatically.

You can also do it all by hand. Copy `patches/_template` to the next free number, then read [`docs/patch-api.md`](docs/patch-api.md).

## Running it locally

Either:

- double-click `index.html`, or
- run `python3 -m http.server 8000` and open <http://localhost:8000> (or use `npx serve`).

Controls:

- Drag to explore.
- Scroll or pinch to zoom.
- Arrow keys and `+`/`-` also work.
- **Home** goes back to the welcome sign.
- **Checklist** (bottom right) reopens the instructions and to-do list.

## How it works

```
index.html, style.css     the page and the welcome modal
src/                      the engine: pixel helpers, world, patch API, loader, camera
patches/NN/patch.js       one resident per numbered folder
patches/_template/        what each new resident starts from
patches/_example/         a finished example patch
docs/patch-api.md         everything a patch can do
AGENTS.md                 the step-by-step playbook for AI agents (CLAUDE.md points to it)
```

- **No manifest file.** The page probes `patches/01/patch.js`, `patches/02/patch.js`, and so on. Joining never means editing a shared file, so the only possible conflict is two people creating the same folder number. That shows up as an obvious *"both added"* conflict, and the fix is to move to the next number.
- **Errors stay contained.** Every patch is clipped to its own square, and its drawing code is wrapped in error handling. A mistake in one patch shows an "OOPS!" sign without breaking anyone else's.
