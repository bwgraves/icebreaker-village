/*
 * A finished example patch. It isn't loaded by the village (only numbered
 * folders are), so copy ideas from it freely. To preview it, copy this
 * folder to a free number such as patches/01, then delete that copy again.
 *
 * Everything is wrapped in (() => { ... })(); so names like `flower` don't
 * clash with other people's patches. All patches share one page!
 */
(() => {
const flower = Village.sprite(
  [
    ".p.",
    "pyp",
    ".p.",
    ".g.",
  ],
  { p: "#ff9ecb", y: "#ffe066", g: "#3f8a2c" }
);

Village.patch({
  name: "Pixel Pat",

  // 1. Character: a 12×20 pixel-map. Two frames make a gentle wave.
  character: {
    fps: 2,
    palette: {
      h: "#6b3e26", // hair
      s: "#f2c29b", // skin
      e: "#222222", // eyes
      m: "#c0504d", // mouth
      t: "#3b82c4", // top
      p: "#3a3a5a", // trousers
      b: "#5a3a22", // boots
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

  // 2. House: drawn with rectangles using the draw() escape hatch.
  house: {
    draw(g) {
      const w = 60, x = Math.round(g.w / 2 - w / 2), base = g.h - 2;
      const wallTop = base - 30;
      // chimney + smoke
      g.rect(x + 42, wallTop - 18, 6, 12, "#7a3b2e");
      const puff = Math.floor(g.t * 2) % 3;
      g.rect(x + 43 + puff, wallTop - 22 - puff * 2, 3, 3, "rgba(255,255,255,0.7)");
      // roof
      for (let i = 0; i < 16; i++) {
        const half = 6 + i * 2;
        g.rect(x + w / 2 - half, wallTop - 16 + i, half * 2, 1, i % 4 === 3 ? "#9c3b30" : "#c2473a");
      }
      // walls
      g.rect(x, wallTop, w, 30, "#f3e2c0");
      g.rect(x, wallTop, w, 2, "#d8c39b");
      // door
      g.rect(x + 25, base - 18, 10, 18, "#5b3a1f");
      g.px(x + 33, base - 9, "#ffe066");
      // windows
      for (const wx of [x + 7, x + 43]) {
        g.rect(wx, wallTop + 7, 10, 9, "#5b3a1f");
        g.rect(wx + 1, wallTop + 8, 8, 7, "#9fd8ff");
        g.rect(wx + 5, wallTop + 8, 1, 7, "#5b3a1f");
        g.rect(wx, wallTop + 16, 10, 2, "#3f8a2c");
      }
    },
  },

  // 3. Garden: vegetable rows and flowers, scattered with a seeded random
  //    generator so they stay in the same place every frame.
  garden: {
    draw(g) {
      for (let row = 0; row < 3; row++) {
        g.rect(8, 6 + row * 12, 60, 6, "#7a5230");
        for (let i = 0; i < 6; i++) g.rect(11 + i * 10, 4 + row * 12, 3, 3, row === 1 ? "#ff7b2e" : "#4caf50");
      }
      const r = g.rng("flowers");
      for (let i = 0; i < 14; i++) g.sprite(flower, 80 + Math.floor(r() * 66), 4 + Math.floor(r() * 32));
    },
  },

  // 4. Thought bubble
  thought: "Ask me about sourdough!",

  // 5. Pet: a ginger cat that strolls around the yard.
  pet: {
    name: "Biscuit",
    wander: true,
    pixels: [
      "......o..o",
      "......oooo",
      "o.....oeoe",
      "o.....oooo",
      ".ooooooooo",
      ".oooooooo.",
      ".o.o..o.o.",
    ],
    palette: { o: "#e8913a", e: "#222222" },
  },
});
})();
