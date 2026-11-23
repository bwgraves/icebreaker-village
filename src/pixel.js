/*
 * Pixel helpers: turn string pixel-maps into cached canvases, draw text,
 * and make deterministic random numbers.
 *
 * A pixel-map is an array of equal-length strings. Each character is one
 * pixel and is looked up in a palette object. "." and " " are transparent.
 */
(function () {
  "use strict";
  const V = (window.Village = window.Village || {});

  const FONT = '"Press Start 2P", ui-monospace, monospace';
  // Narrower, more readable pixel font for longer text (thought bubbles).
  const BODY_FONT = '"Pixelify Sans", system-ui, sans-serif';
  const cache = new Map();
  const CACHE_LIMIT = 4000;
  const warned = new Set();

  function warnOnce(key, ...msg) {
    if (warned.has(key)) return;
    warned.add(key);
    console.warn("[Icebreaker Village]", ...msg);
  }

  function size(pixels) {
    let w = 0;
    for (const row of pixels) w = Math.max(w, row.length);
    return { w, h: pixels.length };
  }

  function render(pixels, palette) {
    palette = palette || {};
    const key = pixels.join("|") + "#" + JSON.stringify(palette);
    let c = cache.get(key);
    if (c) return c;

    const { w, h } = size(pixels);
    c = document.createElement("canvas");
    c.width = Math.max(1, w);
    c.height = Math.max(1, h);
    const cx = c.getContext("2d");
    pixels.forEach((row, y) => {
      if (row.length !== w) {
        warnOnce("row:" + key, `Pixel-map row ${y} is ${row.length} wide but the widest row is ${w}. Rows should all be the same length.`, pixels);
      }
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === "." || ch === " ") continue;
        const color = palette[ch];
        if (!color) {
          warnOnce("pal:" + ch + key, `No palette colour for "${ch}" in pixel-map.`, pixels);
          continue;
        }
        cx.fillStyle = color;
        cx.fillRect(x, y, 1, 1);
      }
    });

    if (cache.size > CACHE_LIMIT) cache.clear();
    cache.set(key, c);
    return c;
  }

  function draw(ctx, pixels, palette, x, y, opts) {
    opts = opts || {};
    const c = render(pixels, palette);
    const s = Math.max(1, Math.round(opts.scale || 1));
    const w = c.width * s;
    const h = c.height * s;
    x = Math.round(x);
    y = Math.round(y);
    if (opts.flip) {
      ctx.save();
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(c, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(c, x, y, w, h);
    }
    return { x, y, w, h };
  }

  function setFont(ctx, sizePx, family) {
    ctx.font = `${family === "body" ? "600 " : ""}${sizePx}px ${family === "body" ? BODY_FONT : FONT}`;
  }

  function text(ctx, str, x, y, opts) {
    opts = opts || {};
    setFont(ctx, opts.size || 8, opts.font);
    ctx.textBaseline = "top";
    ctx.textAlign = opts.align || "left";
    ctx.fillStyle = opts.color || "#222";
    ctx.fillText(String(str), x, y);
  }

  function measure(ctx, str, sizePx, family) {
    setFont(ctx, sizePx || 8, family);
    return ctx.measureText(String(str)).width;
  }

  function hash(str) {
    let h = 2166136261;
    str = String(str);
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32: small, fast, deterministic PRNG returning [0, 1)
  function rng(seed) {
    let a = typeof seed === "number" ? seed >>> 0 : hash(seed);
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  V.Pixel = { FONT, BODY_FONT, size, render, draw, text, measure, hash, rng, warnOnce };

  // Convenience for patch authors: define a sprite once, reuse it anywhere.
  V.sprite = function (pixels, palette) {
    return { pixels, palette };
  };

  // Kick off the pixel font download so canvas text picks it up.
  if (document.fonts && document.fonts.load) {
    document.fonts.load(`8px ${FONT}`).catch(() => {});
    document.fonts.load(`600 11px ${BODY_FONT}`).catch(() => {});
  }
})();
