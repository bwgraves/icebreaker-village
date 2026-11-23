/*
 * 🏡 Icebreaker Village patch template
 *
 * This already draws a complete, working patch. Copy it to
 * patches/_draft/patch.js, then CHANGE it to match the person's answers:
 * recolour things, add details, or replace a whole section with something
 * new (a teapot house? a dragon pet? go for it). Good enough is perfect.
 *
 * ── Cheat sheet ──────────────────────────────────────────────────────────
 * Zones (local coords, 0,0 = top-left of the zone):
 *   garden 152×40 (top) · house 152×56 (middle) · yard 152×56 (bottom; character + pet)
 * Each part is either { pixels: [...rows], palette: {char: colour} }
 *   (or { frames: [rows, rows], fps: 2 } to animate; "." = transparent)
 *   or { draw(g, t) { ... } } using:
 *   g.rect(x, y, w, h, colour)      g.px(x, y, colour)
 *   g.circle(cx, cy, r, colour)     g.triangle(x, y, w, h, colour)  // points up
 *   g.text(str, x, y, {size: 8, color})
 *   g.rng("seed") -> stable random 0..1      g.w, g.h = zone size     t = seconds
 * Sizes: person ~12×20, pet ~10×8 (draw it facing right), house ~60×46.
 * Pixel-map rows must all be the same length, and every char needs a palette colour.
 * Keep the (() => { ... })(); wrapper: all patches share one page.
 * ─────────────────────────────────────────────────────────────────────────
 */
(() => {
  Village.patch({
    // 1. Name plate
    name: "Your Name",

    // 2. Your 8-bit self. Change the palette for hair/skin/clothes; edit rows for
    //    hairstyles, hats, glasses (add a new letter + colour). Frame 2 waves.
    character: {
      fps: 2,
      palette: {
        h: "#6b3e26", // hair
        s: "#f2c29b", // skin
        e: "#222222", // eyes
        m: "#c0504d", // mouth
        t: "#3b82c4", // top
        p: "#3a3a5a", // trousers
        b: "#5a3a22", // shoes
      },
      frames: [
        [
          "....hhhh....",
          "...hhhhhh...",
          "..hhhhhhhh..",
          "..hssssssh..",
          "..sesssses..",
          "..ssssssss..",
          "...ssmmss...",
          "....ssss....",
          "...tttttt...",
          "..tttttttt..",
          ".tttttttttt.",
          ".tttttttttt.",
          ".stttttttts.",
          "..tttttttt..",
          "..pppppppp..",
          "..ppp..ppp..",
          "..ppp..ppp..",
          "..ppp..ppp..",
          "..bbb..bbb..",
          ".bbbb..bbbb.",
        ],
        [
          "....hhhh...s",
          "...hhhhhh..s",
          "..hhhhhhhh.t",
          "..hssssssh.t",
          "..sesssses.t",
          "..ssssssss.t",
          "...ssmmss..t",
          "....ssss..tt",
          "...tttttttt.",
          "..ttttttttt.",
          ".ttttttttt..",
          ".tttttttt...",
          ".sttttttt...",
          "..tttttttt..",
          "..pppppppp..",
          "..ppp..ppp..",
          "..ppp..ppp..",
          "..ppp..ppp..",
          "..bbb..bbb..",
          ".bbbb..bbbb.",
        ],
      ],
    },

    // 3. House. Change the colours, or replace the whole draw() with their dream home.
    house: {
      draw(g) {
        const wall = "#f3e2c0", roof = "#c2473a", door = "#5b3a1f", glass = "#9fd8ff";
        const w = 60, x = Math.round(g.w / 2 - w / 2), base = g.h - 2, top = base - 30;
        const puff = Math.floor(g.t * 2) % 3;
        g.rect(x + 42, top - 18, 6, 12, "#7a3b2e"); // chimney
        g.rect(x + 43 + puff, top - 22 - puff * 2, 3, 3, "rgba(255,255,255,0.7)"); // smoke
        g.triangle(x - 4, top - 16, w + 8, 16, roof); // roof
        g.rect(x, top, w, 30, wall); // walls
        g.rect(x + 25, base - 18, 10, 18, door); // door
        g.px(x + 33, base - 9, "#ffe066"); // door knob
        for (const wx of [x + 7, x + 43]) {
          g.rect(wx, top + 7, 10, 9, door);
          g.rect(wx + 1, top + 8, 8, 7, glass);
          g.rect(wx, top + 16, 10, 2, "#3f8a2c"); // window box
        }
      },
    },

    // 4. Back garden. Swap in whatever they described.
    garden: {
      draw(g) {
        for (let row = 0; row < 3; row++) {
          g.rect(8, 6 + row * 12, 60, 6, "#7a5230"); // veg beds
          for (let i = 0; i < 6; i++) g.rect(11 + i * 10, 4 + row * 12, 3, 3, row === 1 ? "#ff7b2e" : "#4caf50");
        }
        g.rect(124, 16, 4, 22, "#6b4226"); // tree trunk
        g.circle(126, 14, 11, "#3f8a2c"); // tree canopy
        const r = g.rng("flowers");
        for (let i = 0; i < 12; i++) g.circle(80 + Math.floor(r() * 30), 6 + Math.floor(r() * 30), 1, "#ff9ecb");
      },
    },

    // 5. Thought bubble: up to ~70 characters, emoji welcome.
    thought: "Ask me about sourdough!",

    // 6. Pet. Recolour or redraw (facing right). wander: true lets it roam.
    pet: {
      name: "Biscuit",
      wander: true,
      palette: { o: "#e8913a", e: "#222222" },
      pixels: [
        "......o..o",
        "......oooo",
        "o.....oeoe",
        "o.....oooo",
        ".ooooooooo",
        ".oooooooo.",
        ".o.o..o.o.",
      ],
    },
  });
})();
