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

> [!IMPORTANT]
> **Everyone taking part must be added as a collaborator on the GitHub repo before the meeting.** Without it, they can clone and check out the branch but **can't push their patch**: they'll get a 403 / "Permission denied" error. See the setup steps below.

### One-off GitHub setup: let people push

GitHub only lets people push to a repo if they have **write access**. Branch rules (rulesets) can't open a repo up to everyone; they can only *restrict* people who already have access. So setup has two parts: give participants write access, then use rulesets to keep `main` safe.

**1. Add every participant as a collaborator (required)**

- **Repo under your personal account:**
  1. Go to **Settings → Collaborators → Add people** and invite each participant by GitHub username or email.
  2. They need to **accept the invite**, either from the email or at `https://github.com/<owner>/icebreaker-village/invitations`, before they can push.
  3. Do this before the meeting. Pushes fail with a 403 / "Permission denied" until the invite is accepted.
- **Repo in a GitHub organisation (easier for a whole team):**
  1. Create a team (e.g. `icebreakers`).
  2. In the repo, go to **Settings → Collaborators and teams → Add teams** and give the team the **Write** role.
  3. Anyone you add to the team can push straight away, with no per-person invite to accept.

**2. Protect `main` with rulesets**

Go to **Settings → Rules → Rulesets → New ruleset → New branch ruleset** and create two rulesets.

| Ruleset | Target branches | Rules to tick | Bypass list |
| --- | --- | --- | --- |
| `protect-main` | *Include default branch* | Restrict deletions · Block force pushes · Require a pull request before merging | Repository admin (you) |
| `session-branches` | *Include by pattern:* `icebreaker/**` | Restrict deletions · Block force pushes | Repository admin (you) |

Set both to **Active**. Participants can then push ordinary commits to session branches. Nobody else can change `main`, delete a session branch or rewrite its history, so one person's mistake can't wipe out everyone's patches. The agent playbook never needs a force push.

Rulesets are free on public repos. Private repos need GitHub Pro, Team or Enterprise.

**Someone you can't add as a collaborator?** They can fork the repo, push their patch to their fork, and open a pull request into the session branch for you to merge.

### Running a session

1. Create a branch for the session and push it:
   ```sh
   git checkout main && git pull
   git checkout -b icebreaker/2026-11-23-design-team
   git push -u origin icebreaker/2026-11-23-design-team
   ```
2. Share the repo URL and the branch name with everyone.
3. Open `index.html` and share your screen. Every few minutes, `git pull` and refresh the page to watch new neighbours move in.
4. Afterwards, leave the branch as a keepsake. **Don't merge session branches into `main`.** `main` should always be an empty village. If you like, remove the collaborators afterwards.

Tip: if the repo is on GitHub, you can enable GitHub Pages for the session branch so everyone can see the village at a URL without running anything.

## For participants

**What you need:** git, a web browser and an AI coding agent. You don't need Node, npm, Python or anything else.
- On a Mac, git and bash come with the Command Line Tools: run `git --version` and accept the install prompt if one appears.
- On Windows, install [Git for Windows](https://git-scm.com/download/win), which includes Git Bash.

1. Make sure your host has **added you as a collaborator** on the GitHub repo, and **accept the invite** from the email or at `https://github.com/<owner>/icebreaker-village/invitations`. You can't push your patch without this.
2. Clone the repo (if you haven't already), then check out the session branch:
   ```sh
   git clone https://github.com/<owner>/icebreaker-village.git
   cd icebreaker-village
   git fetch origin
   git checkout icebreaker/2026-11-23-design-team
   ```
3. Open your AI coding agent (Claude Code, Codex, Cursor, Copilot, …) in the repo and say:
   > Read AGENTS.md and add me to Icebreaker Village.
4. It asks you six quick questions in one go. Answer in a few words each; there are no wrong answers, so be as imaginative as you like.
5. Let it build and publish (usually a minute or two), then open `index.html` and admire your patch.

The agent writes your patch in `patches/_draft/`, then runs `scripts/move-in.sh`. That script takes the next free plot, commits and pushes. If two people move in at the same moment, the second one is automatically moved to the next free plot.

**Doing it by hand:**
1. Copy `patches/_template/patch.js` to `patches/_draft/patch.js`.
2. Edit it. The cheat sheet at the top of the file explains how, and [`docs/patch-api.md`](docs/patch-api.md) has the full details.
3. Run `bash scripts/move-in.sh`.
4. For later changes, run `bash scripts/save.sh "what changed"`.

## Opening the village

Just open `index.html` in your browser by double-clicking it. There's nothing to install and no server to run. Refresh the page to pick up changes.

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
patches/_template/        a complete starter patch with an API cheat sheet
patches/_draft/           your work-in-progress patch (gitignored)
scripts/move-in.sh        publishes your draft as the next free plot (handles clashes)
scripts/save.sh           commits and pushes later tweaks to your patch
docs/patch-api.md         everything a patch can do
AGENTS.md                 the step-by-step playbook for AI agents (CLAUDE.md points to it)
```

- **No manifest file.** The page probes `patches/01/patch.js`, `patches/02/patch.js`, and so on. Joining never means editing a shared file, so the only possible conflict is two people creating the same folder number. That shows up as an obvious *"both added"* conflict, and the fix is to move to the next number.
- **Errors stay contained.** Every patch is clipped to its own square, and its drawing code is wrapped in error handling. A mistake in one patch shows an "OOPS!" sign without breaking anyone else's.
