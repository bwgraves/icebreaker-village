/*
 * The village itself: grass, dirt paths, the welcome sign, fences,
 * name plates and the slot -> position layout.
 *
 * All coordinates are "art pixels". The engine scales them up.
 */
(function () {
  "use strict";
  const V = window.Village;
  const P = V.Pixel;

  const PATCH = 160;
  const GAP = 40;
  const MAX_COLS = 8;
  // Columns adapt to the screen (set by the engine) so whole rows are always
  // visible; the village grows downwards as people join.
  let COLS = 5;
  let GRID_LEFT = 0;
  function setCols(n) {
    COLS = Math.min(MAX_COLS, Math.max(1, Math.floor(n)));
    GRID_LEFT = -(COLS * PATCH + (COLS - 1) * GAP) / 2;
  }
  setCols(COLS);
  const GRID_TOP = 150;

  // Areas inside a patch, in patch-local coordinates.
  const ZONES = {
    garden: { x: 4, y: 4, w: 152, h: 40 },
    house: { x: 4, y: 44, w: 152, h: 56 },
    yard: { x: 4, y: 100, w: 152, h: 56 },
  };

  function slotRect(slot) {
    const i = slot - 1;
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
      x: GRID_LEFT + col * (PATCH + GAP),
      y: GRID_TOP + row * (PATCH + GAP),
      w: PATCH,
      h: PATCH,
    };
  }

  // Show every taken slot, plus at least one free plot, in whole rows.
  function slotCount() {
    let max = 0;
    for (const slot of V.patches.keys()) max = Math.max(max, slot);
    return Math.max(Math.max(COLS * 2, 6), Math.ceil((max + 1) / COLS) * COLS);
  }

  function villageBounds() {
    const rows = Math.ceil(slotCount() / COLS);
    return {
      x: GRID_LEFT - GAP / 2,
      y: GRID_TOP - GAP / 2,
      w: COLS * PATCH + COLS * GAP,
      h: rows * (PATCH + GAP),
    };
  }

  /* ---------- Ground textures ---------- */

  function makeTile(size, seed, base, speckles, extra) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const cx = c.getContext("2d");
    cx.fillStyle = base;
    cx.fillRect(0, 0, size, size);
    const r = P.rng(seed);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = r();
        let acc = 0;
        for (const [color, chance] of speckles) {
          acc += chance;
          if (n < acc) {
            cx.fillStyle = color;
            cx.fillRect(x, y, 1, 1);
            break;
          }
        }
      }
    }
    if (extra) extra(cx, r, size);
    return c;
  }

  function tufts(cx, r, size, count) {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(r() * (size - 3));
      const y = Math.floor(r() * (size - 3));
      cx.fillStyle = "#4a8f2f";
      cx.fillRect(x, y + 1, 1, 2);
      cx.fillRect(x + 2, y + 1, 1, 2);
      cx.fillStyle = "#7cc853";
      cx.fillRect(x + 1, y, 1, 3);
    }
  }

  function flowers(cx, r, size, count) {
    const petals = ["#ffffff", "#ffe066", "#ff9ecb", "#b9a6ff"];
    for (let i = 0; i < count; i++) {
      const x = 1 + Math.floor(r() * (size - 3));
      const y = 1 + Math.floor(r() * (size - 3));
      cx.fillStyle = petals[Math.floor(r() * petals.length)];
      cx.fillRect(x - 1, y, 3, 1);
      cx.fillRect(x, y - 1, 1, 3);
      cx.fillStyle = "#f5b301";
      cx.fillRect(x, y, 1, 1);
    }
  }

  let patterns = null;
  function getPatterns(ctx) {
    if (patterns) return patterns;
    const grass = makeTile(
      128, "grass", "#5da93c",
      [["#4f9632", 0.06], ["#6fbd4a", 0.04]],
      (cx, r, s) => { tufts(cx, r, s, 14); flowers(cx, r, s, 5); }
    );
    const lawn = makeTile(
      64, "lawn", "#69b646",
      [["#5ea83d", 0.04], ["#77c454", 0.03]],
      (cx, r, s) => {
        cx.fillStyle = "rgba(255,255,255,0.05)";
        for (let y = 0; y < s; y += 16) cx.fillRect(0, y, s, 8);
      }
    );
    const dirt = makeTile(
      64, "dirt", "#caa36c",
      [["#b58c58", 0.08], ["#d9b582", 0.05], ["#9d8b78", 0.01]]
    );
    patterns = {
      grass: ctx.createPattern(grass, "repeat"),
      lawn: ctx.createPattern(lawn, "repeat"),
      dirt: ctx.createPattern(dirt, "repeat"),
    };
    return patterns;
  }

  function drawGround(ctx, view) {
    const pt = getPatterns(ctx);
    ctx.fillStyle = pt.grass;
    ctx.fillRect(Math.floor(view.x), Math.floor(view.y), Math.ceil(view.w) + 1, Math.ceil(view.h) + 1);

    // Village square (paths between patches) and the path up to the sign.
    const b = villageBounds();
    ctx.fillStyle = pt.dirt;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillRect(-20, 110, 40, b.y - 110);
    ctx.fillStyle = "rgba(90,60,30,0.18)";
    ctx.fillRect(b.x, b.y, b.w, 1);
    ctx.fillRect(b.x, b.y + b.h - 1, b.w, 1);
    ctx.fillRect(b.x, b.y, 1, b.h);
    ctx.fillRect(b.x + b.w - 1, b.y, 1, b.h);
  }

  /* ---------- Welcome sign ---------- */

  function iceCube(ctx, x, y, t, phase) {
    const bob = Math.round(Math.sin(t * 2 + phase));
    y += bob;
    ctx.fillStyle = "#5aa7d6";
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = "#cdeeff";
    ctx.fillRect(x + 1, y + 1, 14, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 2, y + 2, 4, 2);
    ctx.fillRect(x + 2, y + 4, 2, 2);
    ctx.fillStyle = "#1d2b3a";
    ctx.fillRect(x + 5, y + 7, 2, 2);
    ctx.fillRect(x + 10, y + 7, 2, 2);
    ctx.fillRect(x + 6, y + 11, 5, 1);
    ctx.fillRect(x + 5, y + 10, 1, 1);
    ctx.fillRect(x + 11, y + 10, 1, 1);
    ctx.fillStyle = "#ff9ecb";
    ctx.fillRect(x + 3, y + 10, 2, 1);
    ctx.fillRect(x + 12, y + 10, 2, 1);
  }

  function drawSign(ctx, t) {
    const x = -180, y = 24, w = 360, h = 70;
    // posts
    for (const px of [-150, 142]) {
      ctx.fillStyle = "#6b4226";
      ctx.fillRect(px, y + h - 6, 8, 40);
      ctx.fillStyle = "#83542f";
      ctx.fillRect(px, y + h - 6, 3, 40);
    }
    // shadow + board
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x + 4, y + 4, w, h);
    ctx.fillStyle = "#5b3a1f";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#c48a4a";
    ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
    ctx.fillStyle = "#b37a3f";
    for (let py = y + 3 + 15; py < y + h - 3; py += 16) ctx.fillRect(x + 3, py, w - 6, 1);
    ctx.fillStyle = "#d9a466";
    ctx.fillRect(x + 3, y + 3, w - 6, 1);
    // nails
    ctx.fillStyle = "#3b2412";
    for (const [nx, ny] of [[x + 7, y + 7], [x + w - 9, y + 7], [x + 7, y + h - 9], [x + w - 9, y + h - 9]]) {
      ctx.fillRect(nx, ny, 2, 2);
    }
    // text
    P.text(ctx, "Welcome to", 0, y + 14, { size: 8, align: "center", color: "#5b3a1f" });
    P.text(ctx, "Icebreaker Village", 1, y + 31, { size: 16, align: "center", color: "#f6e2b8" });
    P.text(ctx, "Icebreaker Village", 0, y + 30, { size: 16, align: "center", color: "#3b2412" });
    // mascots
    iceCube(ctx, x - 24, y + h - 14, t, 0);
    iceCube(ctx, x + w + 8, y + h - 14, t, 1.7);
    // flower beds at the post bases
    for (const fx of [-162, 154]) {
      ctx.fillStyle = "#4a8f2f";
      ctx.fillRect(fx - 4, y + h + 30, 20, 4);
      const cols = ["#ff9ecb", "#ffe066", "#ffffff"];
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = cols[i];
        ctx.fillRect(fx - 2 + i * 7, y + h + 28, 3, 3);
      }
    }
  }

  /* ---------- Fences & name plates ---------- */

  function drawFence(ctx) {
    const s = PATCH;
    const gateL = s / 2 - 12, gateR = s / 2 + 12;
    const rail = "#d6c4a0", picket = "#f6eedc", shade = "#c2b08c";
    // rails
    ctx.fillStyle = rail;
    ctx.fillRect(0, 1, s, 2);
    ctx.fillRect(1, 0, 2, s);
    ctx.fillRect(s - 3, 0, 2, s);
    ctx.fillRect(0, s - 3, gateL, 2);
    ctx.fillRect(gateR, s - 3, s - gateR, 2);
    // pickets
    for (let i = 0; i < s; i += 8) {
      ctx.fillStyle = picket;
      ctx.fillRect(i, 0, 4, 4);
      ctx.fillRect(0, i, 4, 4);
      ctx.fillRect(s - 4, i, 4, 4);
      if (i + 4 <= gateL || i >= gateR) ctx.fillRect(i, s - 4, 4, 4);
      ctx.fillStyle = shade;
      ctx.fillRect(i + 3, 0, 1, 4);
      ctx.fillRect(0, i + 3, 4, 1);
      ctx.fillRect(s - 4, i + 3, 4, 1);
      if (i + 4 <= gateL || i >= gateR) ctx.fillRect(i + 3, s - 4, 1, 4);
    }
    // gate posts
    ctx.fillStyle = "#8a6a45";
    ctx.fillRect(gateL - 2, s - 6, 3, 6);
    ctx.fillRect(gateR - 1, s - 6, 3, 6);
  }

  function drawNamePlate(ctx, rect, name, muted) {
    const label = String(name).slice(0, 20);
    const tw = Math.ceil(P.measure(ctx, label, 8));
    const w = tw + 12, h = 14;
    const x = Math.round(rect.x + rect.w / 2 - w / 2);
    const y = rect.y + rect.h + 5;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(x + 2, y + 2, w, h);
    ctx.fillStyle = muted ? "#8c7b66" : "#5b3a1f";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = muted ? "#cbbba5" : "#e7b877";
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    P.text(ctx, label, x + w / 2, y + 4, { size: 8, align: "center", color: muted ? "#6e604f" : "#3b2412" });
  }

  /* ---------- Ambient life ---------- */

  const BUTTERFLY_OPEN = ["pp.pp", "ppbpp", ".pbp."];
  const BUTTERFLY_SHUT = [".p.p.", "..b..", ".p.p."];
  const BUTTERFLY_COLOURS = ["#ffe066", "#ff9ecb", "#ffffff", "#9fd8ff", "#ffb35c", "#c7a6ff"];

  function drawAmbient(ctx, view, t) {
    const b = villageBounds();
    for (let i = 0; i < 8; i++) {
      const r = P.rng("butterfly" + i);
      const cx = b.x + r() * b.w;
      const cy = b.y - 60 + r() * (b.h + 60);
      const x = cx + Math.sin(t * (0.3 + r() * 0.3) + i) * 70;
      const y = cy + Math.sin(t * (0.5 + r() * 0.4) + i * 2) * 30 + Math.sin(t * 7 + i) * 2;
      if (x < view.x - 10 || x > view.x + view.w + 10 || y < view.y - 10 || y > view.y + view.h + 10) continue;
      const open = Math.floor(t * 6 + i) % 2 === 0;
      P.draw(ctx, open ? BUTTERFLY_OPEN : BUTTERFLY_SHUT, { p: BUTTERFLY_COLOURS[i % BUTTERFLY_COLOURS.length], b: "#3b2412" }, x, y);
    }
  }

  V.World = {
    PATCH, GAP, GRID_TOP, ZONES,
    get COLS() { return COLS; },
    setCols, slotRect, slotCount, villageBounds, getPatterns,
    drawGround, drawSign, drawFence, drawNamePlate, drawAmbient,
  };
})();
