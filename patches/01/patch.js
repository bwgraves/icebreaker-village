/*
 * 🏡 Your patch in Icebreaker Village
 *
 * This file lives at patches/NN/patch.js. The folder number IS your plot.
 * Only ever edit files inside your own patches/NN/ folder.
 *
 * Full API: docs/patch-api.md
 * A finished example: patches/_example/patch.js
 *
 * Anything you leave out shows a placeholder on the map, so everyone can see
 * how far through the checklist you are.
 *
 * Keep everything inside the (() => { ... })(); wrapper: every patch shares
 * one page, so top-level names would clash with other people's patches.
 */
(() => {
Village.patch({
  name: "Benjamino",

  // ☐ 1. Add your 8-bit self (front yard, about 12×20 pixels).
  character: {
    fps: 2,
    palette: {
      h: "#6b4226", // messy brown hair
      s: "#f2c29b", // skin
      g: "#111111", // black glasses
      e: "#222222", // eyes
      m: "#c0504d", // mouth
      j: "#8a8d93", // grey jumper
      k: "#6f7279", // jumper shadow
      n: "#6e6659", // grey-brown jeans
      b: "#3a2a1e", // shoes
    },
    frames: [
      [
        "...h.hh.h...",
        "..hhhhhhhhh.",
        ".hhhhhhhhhhh",
        ".hhssssssshh",
        ".ggggsgggg..",
        ".gesgsgesg..",
        ".hssssssssh.",
        "...ssmmss...",
        "....ssss....",
        "..jjjjjjjj..",
        ".jjjjjjjjjj.",
        ".jjjkkkkjjj.",
        ".sjjjjjjjjs.",
        ".sjjjjjjjjs.",
        "..jjjjjjjj..",
        "..nnnnnnnn..",
        "..nnn..nnn..",
        "..nnn..nnn..",
        "..nnn..nnn..",
        "..bbb..bbb..",
      ],
      [
        "...h.hh.h...",
        "..hhhhhhhhh.",
        ".hhhhhhhhhhh",
        ".hhssssssshh",
        ".ggggsgggg..",
        ".gssgsgssg..",
        ".hssssssssh.",
        "...ssmmss...",
        "....ssss...s",
        "..jjjjjjjj.s",
        ".jjjjjjjjjjs",
        ".jjjkkkkjjj.",
        ".sjjjjjjjjj.",
        ".sjjjjjjjjj.",
        "..jjjjjjjj..",
        "..nnnnnnnn..",
        "..nnn..nnn..",
        "..nnn..nnn..",
        "..nnn..nnn..",
        "..bbb..bbb..",
      ],
    ],
  },

  // ☐ 2. Build yourself a house (house zone is 152×56, sits in the middle).
  house: {
    draw(g, t) {
      const WHITE = "#f7f5ef", SHADE = "#dcd8cc", STONE = "#c9c6bd";
      const GLASS = "#5b7a96", BRICK = "#a0522d", SLATE = "#4a4f5c";

      // Chimneys, with a little animated puff of smoke
      for (const cx of [50, 97]) {
        g.rect(cx, 3, 5, 8, BRICK);
        g.rect(cx - 1, 2, 7, 1, "#7a3b20");
        for (let i = 0; i < 3; i++) {
          const p = (t * 0.6 + i / 3) % 1;
          g.px(cx + 2 + Math.round(Math.sin(p * 6 + cx) * 1.5), Math.round(1 - p * 1), `rgba(210,210,215,${1 - p})`);
        }
      }

      // Slate roof behind the parapet
      g.rect(52, 7, 48, 1, SLATE);
      g.rect(50, 8, 52, 1, SLATE);
      g.rect(48, 9, 56, 2, SLATE);

      // Cornice
      g.rect(45, 11, 62, 2, WHITE);
      g.rect(45, 13, 62, 1, STONE);

      // Walls, floor bands and side shading
      g.rect(47, 14, 58, 38, WHITE);
      g.rect(47, 14, 1, 38, SHADE);
      g.rect(104, 14, 1, 38, SHADE);
      g.rect(47, 25, 58, 1, SHADE);
      g.rect(47, 38, 58, 1, SHADE);

      // Sash window: frame, glass, glazing bars, sill
      const win = (x, y, w, h) => {
        g.rect(x - 1, y - 1, w + 2, h + 2, STONE);
        g.rect(x, y, w, h, GLASS);
        g.rect(x + Math.floor(w / 2) - 1, y, 1, h, WHITE);
        g.rect(x, y + Math.floor(h / 2), w, 1, WHITE);
        g.rect(x - 1, y + h + 1, w + 2, 1, SHADE);
      };
      for (const x of [55, 73, 91]) {
        win(x, 15, 6, 7);   // top floor
        win(x, 27, 6, 10);  // first floor (tallest)
      }
      for (const x of [55, 91]) win(x, 41, 6, 9); // ground floor

      // Front door surround, fanlight and red door
      g.rect(70, 39, 12, 13, "#e8e6e0");
      g.rect(69, 38, 14, 1, STONE);
      g.rect(72, 40, 8, 2, GLASS);
      g.rect(75, 40, 1, 2, WHITE);
      g.rect(72, 42, 8, 10, "#b3262e");
      g.rect(73, 43, 2, 4, "#8f1c23");
      g.rect(77, 43, 2, 4, "#8f1c23");
      g.rect(73, 48, 2, 3, "#8f1c23");
      g.rect(77, 48, 2, 3, "#8f1c23");
      g.px(78, 47, "#e0b030"); // brass knob

      // Plinth, steps and black railings
      g.rect(46, 52, 60, 4, "#a8a498");
      g.rect(68, 53, 16, 1, "#d9d6cc");
      g.rect(66, 54, 20, 2, "#d9d6cc");
      for (let x = 47; x < 66; x += 3) g.rect(x, 53, 1, 3, "#222222");
      for (let x = 87; x < 106; x += 3) g.rect(x, 53, 1, 3, "#222222");
      g.rect(47, 53, 19, 1, "#222222");
      g.rect(87, 53, 19, 1, "#222222");
    },
  },

  // ☐ 3. Zhuzh your back garden (top strip, 152×40).
  // garden: { draw(g, t) { ... } },

  // ☐ 4. Give your character a thought bubble (keep it short!).
  // thought: "Ask me about ...",

  // ☐ 5. Adopt a pet (front yard, about 10×8 pixels).
  // pet: { name: "...", pixels: [ ... ], palette: { ... }, wander: true },
});
})();
