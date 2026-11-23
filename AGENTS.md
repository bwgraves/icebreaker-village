# AGENTS.md: How to add someone to Icebreaker Village

You're helping a person move into **Icebreaker Village**, a static 8‑bit village used as a team icebreaker. Each person gets one square patch. They put themself, a house, a back garden, a thought bubble and a pet in it. Everyone is pushing to the same git branch at the same time, so follow the claiming steps below carefully.

**The point is conversation.** Ask the person short, fun questions as you go: what their dream house looks like, what pet they'd adopt, what people could ask them about. Turn their answers into their patch. Don't just invent everything yourself.

## Ground rules

1. **Only create or edit files inside your person's own `patches/NN/` folder.** Never touch `index.html`, `src/`, `docs/`, other people's patches or this file. That's what keeps merge conflicts down to a single, obvious case.
2. Draw everything in code: pixel-maps or `g.rect` calls. No external images, network requests or libraries.
3. Keep it wholesome and friendly. Everyone in the meeting can see it.
4. Never work on `main`. Use the session branch the host shared (for example `icebreaker/2026-11-23-design-team`).

## Step 1: Get up to date

```sh
git fetch origin
git checkout <session-branch>
git pull --rebase
```

If you don't know the session branch name, ask the person.

## Step 2: Ask for a name

Ask: *"What name should go on your name plate?"* A first name or nickname is fine, up to about 18 characters.

## Step 3: Claim a patch (do this straight away, before any drawing)

1. List the taken slots, both locally and on the remote:
   ```sh
   ls patches
   git ls-tree --name-only origin/<session-branch> patches/
   ```
   Numbered folders (`01`, `02`, …) are taken. Ignore `_template` and `_example`.
2. Pick the **lowest free two-digit number** `NN`. The folder name must be just the number: never `03-sam`, or two people could end up on the same plot without git noticing.
3. Create the patch and set the name:
   ```sh
   cp -r patches/_template patches/NN
   # edit patches/NN/patch.js: name: "Sam"
   ```
4. Commit and push **immediately**. Claiming early makes clashes much less likely.
   ```sh
   git add patches/NN
   git commit -m "Claim patch NN for Sam"
   git push origin <session-branch>
   ```

### If the push is rejected

Run `git pull --rebase`.

- **No conflict:** push again. You're done.
- **Conflict on `patches/NN/patch.js`** (git calls it *"both added"*): someone else claimed `NN` first. Move to the next free slot:
  ```sh
  git rebase --abort
  cp -r patches/NN "$TMPDIR/my-patch"           # save your work somewhere outside the repo
  git diff --stat origin/<session-branch> HEAD  # check: your only changes should be in patches/NN
  git reset --hard origin/<session-branch>      # throw away only your local claim commit(s)
  ls patches                                    # pick the next free number MM
  cp -r "$TMPDIR/my-patch" patches/MM
  git add patches/MM
  git commit -m "Claim patch MM for Sam"
  git push origin <session-branch>
  ```
  Repeat if it happens again. Never edit, move or delete another person's folder to resolve a conflict.

The same recovery works later on. All of your person's work lives in one folder, so it can always be copied to a new number. The loader works out the slot from the folder name, so nothing inside `patch.js` needs to change.

## Step 4: The checklist

Do these in order. For each one: ask a question or two, build it, let the person look, then commit and push (`git pull --rebase` first).

1. **Add your 8‑bit self and style yourself.** Ask about hair, outfit, glasses, a favourite colour or an accessory. This goes in `character`: about 12×20 pixels in the front yard. Two animation `frames` (a wave, a blink) are a nice touch.
2. **Build yourself a house.** Ask about their dream home: cottage, castle, treehouse, houseboat, igloo? This goes in `house`, a zone of 152×56. Aim for roughly 60 wide.
3. **Zhuzh your back garden.** Ask what they'd grow or put out there: veg patch, pond, hot tub, hammock, garden gnomes? This goes in `garden`, a 152×40 strip at the top. Use `g.rng(seed)` for scattering things.
4. **Give your character a thought bubble.** Ask for a fun fact, a hot take, or something people can ask them about. This goes in `thought`: a short string of up to about 40 characters, and emoji work.
5. **Adopt a pet.** Ask what pet they'd adopt and what it's called. This goes in `pet`: about 10×8 pixels, drawn facing right, with `wander: true` to let it roam.

Commit messages should be friendly and specific, for example `Sam builds a lighthouse in patch 04`.

## Step 5: Check it

Open the village and find the patch:

- Double-click `index.html`, or
- Run `python3 -m http.server 8000` and visit <http://localhost:8000> (or use `npx serve`).

If you can take screenshots or drive a browser, look at the result yourself. Also check the browser console: errors and pixel-map warnings start with `[Icebreaker Village]`. A part showing an **OOPS!** sign threw an error.

## Reference

- **Full drawing API:** [`docs/patch-api.md`](docs/patch-api.md).
- **Starting point:** [`patches/_template/patch.js`](patches/_template/patch.js).
- **Finished example:** [`patches/_example/patch.js`](patches/_example/patch.js). Copy ideas from it, not the whole thing.

Key facts:

- A patch is 160×160 art pixels.
- Zone-local coordinates: garden 152×40, house 152×56, yard 152×56.
- Every patch must keep its `(() => { ... })();` wrapper, because all patches share one page.
- Each element is either `{ pixels, palette }` (or `frames`) or `{ draw(g, t) }`.

## Working on the village itself (not a patch)

If the person is changing the engine rather than adding themselves:

- Everything is plain HTML, CSS and JS in classic `<script>` tags, with no build step and no dependencies. It has to keep working from `file://`, so don't use ES modules or `fetch` for local files.
- `src/pixel.js`: sprites, text and the random number generator.
- `src/world.js`: layout, grass, the sign, fences and name plates.
- `src/patch-api.js`: `Village.patch` and the per-zone rendering with error isolation.
- `src/loader.js`: probes `patches/NN/patch.js`.
- `src/engine.js`: the camera, input and render loop.
- `src/modal.js`: the welcome modal.

Make engine changes on `main`, not on a session branch.
