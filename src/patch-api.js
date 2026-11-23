/*
 * The API residents use (Village.patch) and the code that renders a patch.
 *
 * Each patch is drawn in four isolated steps: garden, house, yard (pet +
 * character) and thought bubble. Each step is clipped to its zone and wrapped
 * in try/catch, so a mistake in one patch can never break the rest of the
 * village. It just shows an "OOPS!" sign instead.
 */
(function () {
  "use strict";
  const V = window.Village;
  const P = V.Pixel;
  const W = V.World;
  const D = V.Defaults;

  V.patches = new Map(); // slot -> { slot, spec, broken, errors }

  V.patch = function (spec) {
    const script = document.currentScript;
    const slot = script && Number(script.dataset.slot);
    if (!slot) {
      console.warn("[Icebreaker Village] Village.patch() must be called from patches/NN/patch.js");
      return;
    }
    if (!spec || typeof spec !== "object") spec = {};
    if (typeof spec.name !== "string" || !spec.name.trim()) {
      console.warn(`[Icebreaker Village] Patch ${slot} has no name.`);
    }
    V.patches.set(slot, { slot, spec, broken: false, errors: {} });
  };

  function makeG(ctx, zone, t, slot) {
    function rect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
    return {
      ctx,
      w: zone.w,
      h: zone.h,
      t,
      slot,
      rect,
      px(x, y, color) {
        rect(x, y, 1, 1, color);
      },
      // g.sprite(spriteObj, x, y, opts) or g.sprite(pixels, palette, x, y, opts)
      sprite(a, b, c, d, e) {
        if (Array.isArray(a)) return P.draw(ctx, a, b, c, d, e);
        return P.draw(ctx, a.pixels, a.palette, b, c, d);
      },
      text(str, x, y, opts) {
        P.text(ctx, str, x, y, opts);
      },
      measure(str, size) {
        return P.measure(ctx, str, size);
      },
      rng(seed) {
        return P.rng(`${slot}:${seed === undefined ? "" : seed}`);
      },
    };
  }

  // Run fn inside a clipped, translated zone. Errors switch the zone to
  // the "OOPS!" sign for the rest of the session.
  function inZone(ctx, entry, key, zone, t, fn) {
    ctx.save();
    ctx.translate(zone.x, zone.y);
    ctx.beginPath();
    ctx.rect(0, 0, zone.w, zone.h);
    ctx.clip();
    const g = makeG(ctx, zone, t, entry ? entry.slot : 0);
    let result;
    if (entry && entry.errors[key]) {
      D.construction(g);
    } else {
      try {
        result = fn(g);
      } catch (err) {
        if (entry) {
          entry.errors[key] = true;
          console.error(`[Icebreaker Village] Patch ${entry.slot} (${entry.spec.name || "?"}) failed drawing "${key}":`, err);
        }
      }
    }
    ctx.restore();
    return result;
  }

  function isSpriteSpec(el) {
    return el && (Array.isArray(el.pixels) || Array.isArray(el.frames));
  }

  function frameOf(el, t) {
    if (Array.isArray(el.frames) && el.frames.length) {
      const fps = el.fps || 2;
      return el.frames[Math.floor(t * fps) % el.frames.length];
    }
    return el.pixels;
  }

  // Draw a sprite-style element. place(w, h) returns default {x, y}.
  function drawSpriteEl(g, el, place, extra) {
    const pixels = frameOf(el, g.t);
    const s = Math.max(1, Math.round(el.scale || 1));
    const size = P.size(pixels);
    const w = size.w * s, h = size.h * s;
    const def = place(w, h);
    const x = el.x !== undefined ? el.x : def.x;
    const y = el.y !== undefined ? el.y : def.y;
    const o = extra ? extra(x, y, w, h) : { x, y, flip: false };
    g.sprite(pixels, el.palette, o.x, o.y, { scale: s, flip: el.flip ? !o.flip : o.flip });
    return { x: o.x, y: o.y, w, h };
  }

  function drawPart(g, el, place, extra, fallback) {
    if (el && typeof el.draw === "function") {
      const r = el.draw(g, g.t);
      return r && typeof r === "object" ? r : null;
    }
    if (isSpriteSpec(el)) return drawSpriteEl(g, el, place, extra);
    return fallback(g);
  }

  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (P.measure(ctx, test, 8) <= maxW || !line) line = test;
      else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawThought(ctx, text, anchor, t, slot) {
    const S = W.PATCH;
    let lines = wrap(ctx, text, 112);
    if (lines.length > 3) {
      lines = lines.slice(0, 3);
      lines[2] = lines[2].replace(/.{0,3}$/, "...");
    }
    const tw = Math.max(...lines.map((l) => P.measure(ctx, l, 8)));
    const w = Math.ceil(tw) + 12;
    const h = lines.length * 11 + 8;
    const bob = Math.round(Math.sin(t * 1.5 + slot) * 1);
    const x = Math.round(Math.min(Math.max(anchor.x + 8, 6), S - 6 - w));
    const y = Math.round(Math.max(anchor.y - 3 - h, 6)) + bob;

    const ink = "#2b2b3a";
    // trailing thought dots
    ctx.fillStyle = ink;
    ctx.fillRect(anchor.x + 1, anchor.y + 1 + bob, 3, 3);
    ctx.fillRect(anchor.x + 4, anchor.y - 4 + bob, 4, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(anchor.x + 2, anchor.y + 2 + bob, 1, 1);
    ctx.fillRect(anchor.x + 5, anchor.y - 3 + bob, 2, 2);
    // bubble with pixel-rounded corners
    ctx.fillStyle = ink;
    ctx.fillRect(x + 2, y, w - 4, h);
    ctx.fillRect(x, y + 2, w, h - 4);
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 2, y + 1, w - 4, h - 2);
    ctx.fillRect(x + 1, y + 2, w - 2, h - 4);
    lines.forEach((l, i) => P.text(ctx, l, x + 6, y + 5 + i * 11, { size: 8, color: ink }));
  }

  function renderPatch(ctx, slot, t) {
    const entry = V.patches.get(slot);
    const r = W.slotRect(slot);
    const Z = W.ZONES;
    const pt = W.getPatterns(ctx);

    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.fillStyle = pt.lawn;
    ctx.fillRect(0, 0, W.PATCH, W.PATCH);

    if (!entry) {
      inZone(ctx, null, "empty", { x: 0, y: 0, w: W.PATCH, h: W.PATCH }, t, (g) => D.emptyPlot(g, slot));
      W.drawFence(ctx);
      ctx.restore();
      W.drawNamePlate(ctx, r, "Plot " + String(slot).padStart(2, "0"), true);
      return;
    }

    if (entry.broken) {
      inZone(ctx, entry, "broken", { x: 0, y: 0, w: W.PATCH, h: W.PATCH }, t, (g) => D.construction(g));
      W.drawFence(ctx);
      ctx.restore();
      W.drawNamePlate(ctx, r, "Patch " + String(slot).padStart(2, "0"), true);
      return;
    }

    const spec = entry.spec;

    inZone(ctx, entry, "garden", Z.garden, t, (g) =>
      drawPart(g, spec.garden, (w, h) => ({ x: Math.round(g.w / 2 - w / 2), y: Math.round(g.h / 2 - h / 2) }), null, D.garden)
    );

    inZone(ctx, entry, "house", Z.house, t, (g) =>
      drawPart(g, spec.house, (w, h) => ({ x: Math.round(g.w / 2 - w / 2), y: g.h - h - 2 }), null, D.house)
    );

    let charBox = null;
    inZone(ctx, entry, "pet", Z.yard, t, (g) =>
      drawPart(
        g,
        spec.pet,
        (w, h) => ({ x: 96, y: g.h - h - 3 }),
        (x, y, w, h) => {
          if (!spec.pet.wander) return { x, y, flip: false };
          // stroll back and forth across the yard
          const left = 42, right = g.w - w - 6;
          const phase = t * 0.35 + slot;
          const px = left + ((Math.sin(phase) + 1) / 2) * (right - left);
          const hop = Math.abs(Math.cos(phase)) > 0.2 ? -Math.round(Math.abs(Math.sin(t * 8))) : 0;
          return { x: Math.round(px), y: y + hop, flip: Math.cos(phase) < 0 };
        },
        D.pet
      )
    );

    charBox = inZone(ctx, entry, "character", Z.yard, t, (g) =>
      drawPart(g, spec.character, (w, h) => ({ x: 10, y: g.h - h - 3 }), null, D.character)
    );
    if (!charBox) charBox = { x: 10, y: Z.yard.h - 23, w: 12, h: 20 };

    W.drawFence(ctx);

    if (spec.thought && !entry.errors.thought) {
      const text = typeof spec.thought === "string" ? spec.thought : spec.thought.text;
      const anchor = { x: Z.yard.x + charBox.x + charBox.w, y: Z.yard.y + charBox.y };
      inZone(ctx, entry, "thought", { x: 0, y: 0, w: W.PATCH, h: W.PATCH }, t, () =>
        drawThought(ctx, text || "", anchor, t, slot)
      );
    }

    ctx.restore();
    W.drawNamePlate(ctx, r, spec.name || "???", false);
  }

  V.renderPatch = renderPatch;
})();
