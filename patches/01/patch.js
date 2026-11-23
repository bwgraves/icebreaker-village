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
  // house: { draw(g, t) { ... } },

  // ☐ 3. Zhuzh your back garden (top strip, 152×40).
  // garden: { draw(g, t) { ... } },

  // ☐ 4. Give your character a thought bubble (keep it short!).
  // thought: "Ask me about ...",

  // ☐ 5. Adopt a pet (front yard, about 10×8 pixels).
  // pet: { name: "...", pixels: [ ... ], palette: { ... }, wander: true },
});
})();
