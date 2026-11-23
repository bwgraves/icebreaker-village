/*
 * Placeholder art for anything a resident hasn't made yet, plus the
 * "oops" sign shown when a patch throws an error. Placeholders make it
 * easy to see progress through the checklist from the map.
 */
(function () {
  "use strict";
  const V = window.Village;
  const P = V.Pixel;

  const GHOST = [
    "....oooo....",
    "...o....o...",
    "..o......o..",
    "..o......o..",
    "..o.o..o.o..",
    "..o......o..",
    "...o....o...",
    "....oooo....",
    "...o....o...",
    "..o......o..",
    ".o........o.",
    ".o.o....o.o.",
    ".oo......oo.",
    "...o....o...",
    "...o....o...",
    "...o.oo.o...",
    "...o.o.o.o..",
    "...o.o..o...",
    "...o.o..o...",
    "...ooo..ooo.",
  ];
  const GHOST_PAL = { o: "rgba(255,255,255,0.6)" };

  const BOWL = [
    ".bbbbbbbb.",
    "bwwwwwwwwb",
    "bbbbbbbbbb",
    ".bbbbbbbb.",
  ];
  const BOWL_PAL = { b: "#d1495b", w: "#8a2c3a" };

  function board(g, x, y, w, lines, colours) {
    colours = colours || {};
    const h = lines.length * 10 + 6;
    g.rect(x + w / 2 - 1, y + h, 3, 10, "#6b4226");
    g.rect(x, y, w, h, colours.edge || "#5b3a1f");
    g.rect(x + 1, y + 1, w - 2, h - 2, colours.face || "#e7b877");
    lines.forEach((line, i) => {
      g.text(line, x + w / 2, y + 4 + i * 10, { size: 8, align: "center", color: colours.text || "#3b2412" });
    });
  }

  const Defaults = {
    character(g) {
      g.sprite(GHOST, GHOST_PAL, 10, g.h - GHOST.length - 3);
      return { x: 10, y: g.h - GHOST.length - 3, w: 12, h: GHOST.length };
    },

    house(g) {
      // dashed foundation outline + a little "build me" sign
      const w = 64, h = 34, x = Math.round(g.w / 2 - w / 2), y = g.h - h - 2;
      for (let i = 0; i < w; i += 6) {
        g.rect(x + i, y, 3, 1, "#f6eedc");
        g.rect(x + i, y + h - 1, 3, 1, "#f6eedc");
      }
      for (let i = 0; i < h; i += 6) {
        g.rect(x, y + i, 1, 3, "#f6eedc");
        g.rect(x + w - 1, y + i, 1, 3, "#f6eedc");
      }
      board(g, x + w / 2 - 34, y + 4, 68, ["BUILD ME"]);
    },

    garden() {
      // Bare lawn: nothing to draw.
    },

    pet(g) {
      g.sprite(BOWL, BOWL_PAL, 96, g.h - 8);
    },

    emptyPlot(g) {
      board(g, g.w / 2 - 40, g.h / 2 - 22, 80, ["MOVE IN", "HERE!"]);
    },

    construction(g) {
      const x = Math.round(g.w / 2 - 20), y = Math.round(g.h / 2 - 8);
      g.rect(x + 2, y + 6, 2, 12, "#6b4226");
      g.rect(x + 36, y + 6, 2, 12, "#6b4226");
      g.rect(x, y, 40, 8, "#222");
      for (let i = 0; i < 40; i += 8) g.rect(x + i, y, 4, 8, "#ffcc00");
      g.text("OOPS!", g.w / 2, y + 11, { size: 8, align: "center", color: "#fff" });
    },
  };

  V.Defaults = Defaults;
})();
