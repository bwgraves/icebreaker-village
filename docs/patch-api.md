# Patch API

Every resident has one file: `patches/NN/patch.js`. It calls `Village.patch({...})` once. The folder number is the plot, so the file itself never says which slot it's in.

```js
(() => {
  Village.patch({
    name: "Sam",                     // shown on the name plate (required)
    character: { ... },              // front yard
    house:     { ... },              // middle of the patch
    garden:    { ... },              // back garden (top strip)
    thought:   "Ask me about ...",   // bubble above your character
    pet:       { ... },              // front yard
  });
})();
```

Keep the `(() => { ... })();` wrapper. All patches load into the same page, so top-level `const`s would clash with other people's patches and break them.

Every key except `name` is optional. Anything you leave out shows a placeholder on the map: a ghost, a "BUILD ME" sign, an empty pet bowl.

## Layout

Each patch is **160×160 art pixels** with a picket fence round the edge and a gate at the bottom. Inside the fence there are three zones. Each zone has its own local coordinates, with `(0, 0)` at its top-left corner:

| Zone   | Size (w×h) | What goes there                | Default position                       |
| ------ | ---------- | ------------------------------ | -------------------------------------- |
| garden | 152×40     | `garden`                       | centred                                |
| house  | 152×56     | `house`                        | centred horizontally, on the bottom    |
| yard   | 152×56     | `character` (left) and `pet`   | character at x=10, pet at x=96, on the bottom |

The thought bubble floats in the front yard, beside your character's head. Everything is clipped to its zone, so you can't draw over your neighbours.

For scale: a person is about **12×20**, a pet about **10×8**, and a house about **60×46**.

## Two ways to draw anything

Every element (`character`, `house`, `garden`, `pet`) accepts either of these.

### 1. A pixel-map

```js
character: {
  pixels: [
    "..hh..",
    ".hssh.",
    "..tt..",
    ".t..t.",
  ],
  palette: { h: "#6b3e26", s: "#f2c29b", t: "#3b82c4" },
  scale: 1,     // optional integer zoom
  x: 20, y: 25, // optional, zone-local; defaults per the table above
  flip: false,  // optional mirror
}
```

- One character is one pixel. `.` and a space are transparent.
- Every row should be the same length. The console warns if they aren't.
- Every character you use needs a colour in `palette`, and any CSS colour works.
- **Animation:** use `frames: [pixelsA, pixelsB, ...]` instead of `pixels`, plus `fps` (default 2).

### 2. A draw function

```js
house: {
  draw(g, t) {
    g.rect(40, 20, 60, 38, "#f3e2c0");
  },
}
```

This is called every frame, already translated and clipped to the zone.

| Helper | Description |
| --- | --- |
| `g.w`, `g.h` | Zone width and height |
| `g.t` / `t` | Time in seconds, for animation |
| `g.rect(x, y, w, h, colour)` | Filled rectangle |
| `g.px(x, y, colour)` | Single pixel |
| `g.sprite(sprite, x, y, opts?)` | Draw a `Village.sprite(...)`. `opts`: `{ scale, flip }` |
| `g.sprite(pixels, palette, x, y, opts?)` | Same, with an inline pixel-map |
| `g.text(str, x, y, { size, color, align }?)` | Pixel-font text. Size 8 is the default and fits about 18 chars across a patch |
| `g.measure(str, size?)` | Width of a piece of text |
| `g.rng(seed)` | Deterministic random function returning numbers in `[0, 1)`. Use it for scattering things so they don't jump around every frame |
| `g.ctx` | The raw `CanvasRenderingContext2D`, if you really need it |

`character.draw` can return `{ x, y, w, h }` so the thought bubble knows where your head is.

## Reusable sprites

```js
const tulip = Village.sprite(["r", "g"], { r: "#e33", g: "#3a3" });

garden: {
  draw(g) {
    for (let i = 0; i < 10; i++) g.sprite(tulip, 10 + i * 6, 20);
  },
}
```

## `thought`

A short string. It wraps to 3 lines at most (roughly 40 characters), and emoji work.

## `pet`

A pet takes the same options as any element, plus:

- `name`: your pet's name.
- `wander: true`: it strolls back and forth across the yard, facing the way it walks. Draw your pet **facing right**.

## When something goes wrong

- If one part throws an error, only that part turns into an **OOPS!** sign. Check the browser console for the details.
- If the file has a syntax error, the whole patch shows **OOPS!**.
- The rest of the village is never affected.

## Rules

- Only edit files inside your own `patches/NN/` folder.
- Draw everything in code. No network requests, no external images, no `<script>` injection.
- Keep it wholesome.
