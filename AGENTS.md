# AGENTS.md: Add someone to Icebreaker Village

You're helping a person move into **Icebreaker Village**, a static 8‑bit village used as a quick team icebreaker. Each person gets a square patch containing their 8‑bit self, a house, a back garden, a thought bubble and a pet.

**This should take a couple of minutes, not twenty.**
- Ask everything in one message, then build the whole patch in one go and publish it with one script.
- Good enough is perfect. It's a bit of fun, not a portfolio piece.

## Do NOT

- ❌ Take screenshots, open a browser, start a server or try to "check how it looks". The person will refresh the page themselves.
- ❌ Read `src/`, `docs/`, `index.html`, `README.md` or other people's patches. `patches/_template/patch.js` has everything you need, including an API cheat sheet.
- ❌ Do git by hand. The scripts handle claiming a plot, conflicts and retries.
- ❌ Offer multiple-choice options, or use a question/option-picker tool. Ask open questions in plain text and let the person type.
- ❌ Edit anything outside the person's own patch folder.
- ❌ Polish or iterate unprompted. Build it once, publish, and offer tweaks.

## The fast path (4 steps)

### 1. Ask everything in ONE message

Send this, word for word or close to it, as a normal chat message:

> Welcome to Icebreaker Village! 🏡 Answer these in a few words each. Anything goes, the sillier the better:
> 1. What name should go on your name plate?
> 2. What do you look like as an 8‑bit character?
> 3. Describe your dream house.
> 4. What's in your back garden?
> 5. What's on your mind? (This goes in your thought bubble.)
> 6. Tell me about your pet, real or imaginary. What's it called?

- Don't add examples or suggestions. They anchor everyone to the same ideas.
- If an answer is blank or "dunno", invent something fun yourself rather than asking again.

### 2. Build the draft

```sh
mkdir -p patches/_draft && cp patches/_template/patch.js patches/_draft/patch.js
```

Edit `patches/_draft/patch.js` in a single pass to match their answers. The template already draws a complete patch, so:

- **Name:** set `name`.
- **Character:** change the palette colours (hair, skin, clothes). Add a quick feature if they mentioned one (glasses, hat, beard) by editing a few rows and adding a palette letter.
- **House, garden:** change colours and details. If their idea is different (a castle, a boat, a pond), replace that `draw()` with a few `g.rect`, `g.circle` and `g.triangle` calls. Shapes over pixel-perfection.
- **Thought:** use their words, up to about 70 characters.
- **Pet:** recolour, or redraw a small pixel-map facing right. Set its `name`.

Keep the `(() => { ... })();` wrapper. Keep pixel-map rows the same length, and give every character a palette colour.

### 3. Publish it

```sh
bash scripts/move-in.sh
```

This script:

- syntax-checks the draft;
- pulls the latest changes;
- takes the next free plot number and commits;
- pushes, and automatically retries with the next number if someone else moved in at the same moment.

It prints `MOVED IN: … patch NN`. If it reports a syntax error, fix it and run it again.

The scripts only need git and bash. If Node is installed they also syntax-check the patch; if not, that check is skipped, so don't install anything. Before publishing, take a few seconds to eyeball your brackets and commas, because a broken patch shows an "OOPS!" sign until it's fixed.

### 4. Tell them and finish

Tell them their patch number and to open or refresh `index.html` (double-click it). Offer one round of tweaks.

For tweaks, edit `patches/NN/patch.js`, then run:

```sh
bash scripts/save.sh "Sam adds a moat"
```

## If something goes wrong

- **"You're on 'main'":** ask the person which session branch the host shared, run `git checkout <branch>`, then run the script again.
- **"PUSH NOT ALLOWED" (403 / permission denied):** the person isn't a collaborator on the GitHub repo yet. Tell them to ask the host to add them and to accept the invite, then run `bash scripts/move-in.sh` again. Their draft is safe.
- **"Uncommitted changes outside your draft":** show the person, and ask whether to commit or stash them.
- **No `bash` available** (rare): do it by hand.
  1. `git pull --rebase`.
  2. Copy the draft to the lowest free `patches/NN/` (two digits, number only).
  3. Commit and push.
  4. If the push is rejected with a "both added" conflict on that folder, run `git rebase --abort` and `git reset --hard origin/<branch>`, then retry with the next number. Your draft in `patches/_draft/` is gitignored and survives this.

## Reference (only if you need it)

- **Full drawing API:** `docs/patch-api.md`.
- **Patch layout:** each patch is 160×160. The zones are garden 152×40 (top), house 152×56 (middle) and yard 152×56 (bottom). The character and pet go in the yard.
- **Engine:** the engine (`src/`) is plain classic scripts that must keep working from `file://`. Engine changes go on `main`, never on a session branch.
