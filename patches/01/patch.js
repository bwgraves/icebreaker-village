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
  garden: {
    draw(g, t) {
      // ---- Garage (left) ----
      g.rect(3, 11, 48, 3, "#555a66");          // roof
      g.rect(4, 14, 46, 24, "#b8a690");         // walls
      g.rect(9, 20, 26, 18, "#2b2d33");         // open doorway
      // car being worked on
      g.rect(13, 31, 18, 5, "#c0392b");
      g.rect(17, 28, 10, 3, "#c0392b");
      g.rect(18, 29, 3, 2, "#9ed0e6");
      g.rect(22, 29, 3, 2, "#9ed0e6");
      g.rect(15, 35, 4, 3, "#111111");
      g.rect(25, 35, 4, 3, "#111111");
      g.rect(21, 33, 1, 1, "#f5d76e");          // headlight
      // roller door, rolled up at the top
      g.rect(9, 20, 26, 4, "#d0d3d8");
      for (let y = 21; y < 24; y += 2) g.rect(9, y, 26, 1, "#a9adb5");
      // side door
      g.rect(40, 26, 7, 12, "#6d4c41");
      g.px(45, 32, "#e0b030");

      // ---- Hot tub (middle) ----
      g.rect(58, 28, 34, 10, "#8a5a33");        // wooden body
      for (let x = 61; x < 92; x += 4) g.rect(x, 28, 1, 10, "#6e4527");
      g.rect(57, 24, 36, 4, "#b07a47");         // rim
      g.rect(59, 25, 32, 2, "#4fc3e8");         // water
      for (let i = 0; i < 5; i++) {             // bubbles
        const p = (t * 0.8 + i * 0.37) % 1;
        g.px(62 + i * 6, Math.round(26 - p * 2), "#e8fbff");
      }
      for (let i = 0; i < 3; i++) {             // steam
        const p = (t * 0.4 + i / 3) % 1;
        g.px(68 + i * 8 + Math.round(Math.sin(p * 5 + i) * 1.5), Math.round(22 - p * 10), `rgba(235,240,245,${0.8 - p * 0.8})`);
      }
      g.rect(58, 36, 2, 2, "#5b3a20");

      // ---- Home-made reactor (right): a cheerful DIY cooling tower ----
      const cx = 122;
      for (let y = 6; y < 38; y++) {
        const d = (y - 22) / 16;
        const hw = Math.round(6 + d * d * 5);
        g.rect(cx - hw, y, hw * 2, 1, "#b9bcc2");
        g.rect(cx + hw - 3, y, 3, 1, "#8e929a");
        g.rect(cx - hw, y, 1, 1, "#dfe1e5");
      }
      // hazard stripes at the base
      for (let x = cx - 10; x < cx + 10; x += 2) {
        g.rect(x, 34, 2, 3, ((x - cx) / 2) % 2 === 0 ? "#f2c500" : "#222222");
      }
      // glowing green core window
      const glow = 0.6 + 0.4 * Math.sin(t * 3);
      g.rect(cx - 4, 18, 8, 6, "#222222");
      g.rect(cx - 3, 19, 6, 4, `rgba(80,255,110,${glow})`);
      // duct tape patches and a wobbly pipe
      g.rect(cx - 6, 28, 5, 1, "#9aa0a8");
      g.rect(cx + 2, 12, 4, 1, "#9aa0a8");
      g.rect(cx + 10, 30, 8, 2, "#7a7f88");
      g.rect(cx + 17, 26, 2, 6, "#7a7f88");
      // steam puffs
      for (let i = 0; i < 4; i++) {
        const p = (t * 0.35 + i / 4) % 1;
        g.px(cx - 3 + i * 2 + Math.round(Math.sin(p * 6 + i) * 2), Math.round(5 - p * 5), `rgba(235,240,245,${0.9 - p * 0.9})`);
      }

      // ---- A few flowers in the gaps ----
      const r = g.rng(7);
      for (const [lo, hi] of [[52, 56], [94, 100], [143, 150]]) {
        for (let i = 0; i < 2; i++) {
          const x = Math.floor(lo + r() * (hi - lo));
          const y = 34 + Math.floor(r() * 4);
          g.px(x, y, r() < 0.5 ? "#ff7eb6" : "#ffd84d");
          g.px(x, y + 1, "#3f8f3f");
        }
      }
    },
  },

  // ☐ 4. Give your character a thought bubble (keep it short!).
  thought: "Sometimes I thinks, sometimes I just sits",

  // ☐ 5. Adopt a pet (front yard, about 10×8 pixels).
  pet: {
    name: "Molly",
    fps: 3,
    palette: {
      b: "#1e1e22", // black labrador coat
      d: "#35353c", // floppy ear
      e: "#ffffff", // eye glint
      n: "#5a5a63", // nose
      t: "#e8708a", // tongue
    },
    frames: [
      [
        "......bbb.",
        "b....bbbbb",
        "bbbbbdbebb",
        ".bbbbdbbbn",
        ".bbbbbbbtb",
        ".bbbbbbbb.",
        ".b.b..b.b.",
        ".b.b..b.b.",
      ],
      [
        "......bbb.",
        ".....bbbbb",
        ".bbbbdbebb",
        "bbbbbdbbbn",
        "bbbbbbbbtb",
        ".bbbbbbbb.",
        ".b.b..b.b.",
        ".b.b..b.b.",
      ],
    ],
    wander: true,
  },
});
})();
