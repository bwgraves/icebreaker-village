/*
 * Canvas, camera, input (drag / wheel / pinch / keys) and the render loop.
 */
(function () {
  "use strict";
  const V = window.Village;
  const W = V.World;

  const canvas = document.getElementById("village");
  const ctx = canvas.getContext("2d");
  const cam = { x: 0, y: 0, s: 3 }; // s = device pixels per art pixel (integer)
  let dpr = 1;

  function limits() {
    return { min: Math.max(1, Math.round(dpr)), max: Math.round(10 * dpr) };
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    const { min, max } = limits();
    cam.s = Math.min(max, Math.max(min, cam.s));
    layout();
  }

  function homeScale() {
    const { min, max } = limits();
    return Math.min(max, Math.max(min, Math.round(canvas.width / 900)));
  }

  // Fit as many whole columns of patches as the screen allows at the
  // default zoom, so no plot is ever hidden off the side.
  function layout() {
    const viewW = canvas.width / homeScale();
    W.setCols((viewW - 24 + W.GAP) / (W.PATCH + W.GAP));
  }

  function home() {
    cam.s = homeScale();
    cam.x = 0;
    cam.y = canvas.height / (2 * cam.s) - 4;
  }

  function zoomAt(clientX, clientY, dir) {
    const { min, max } = limits();
    const next = Math.min(max, Math.max(min, cam.s + dir));
    if (next === cam.s) return;
    const sx = clientX * dpr - canvas.width / 2;
    const sy = clientY * dpr - canvas.height / 2;
    const wx = cam.x + sx / cam.s;
    const wy = cam.y + sy / cam.s;
    cam.s = next;
    cam.x = wx - sx / cam.s;
    cam.y = wy - sy / cam.s;
  }

  /* ---------- Input ---------- */

  const pointers = new Map();
  let pinch = null;

  function pinchState() {
    const [a, b] = [...pointers.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  }

  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) pinch = pinchState();
    canvas.classList.add("dragging");
  });

  canvas.addEventListener("pointermove", (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      cam.x -= (dx * dpr) / cam.s;
      cam.y -= (dy * dpr) / cam.s;
    } else if (pointers.size === 2 && pinch) {
      const now = pinchState();
      cam.x -= ((now.mx - pinch.mx) * dpr) / cam.s;
      cam.y -= ((now.my - pinch.my) * dpr) / cam.s;
      const ratio = now.d / pinch.d;
      if (ratio > 1.25) {
        zoomAt(now.mx, now.my, +1);
        pinch = now;
      } else if (ratio < 0.8) {
        zoomAt(now.mx, now.my, -1);
        pinch = now;
      } else {
        pinch = { d: pinch.d, mx: now.mx, my: now.my };
      }
    }
  });

  function release(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) canvas.classList.remove("dragging");
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  let wheelAcc = 0;
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.ctrlKey || Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        wheelAcc += e.deltaY;
        if (Math.abs(wheelAcc) >= 60) {
          zoomAt(e.clientX, e.clientY, wheelAcc > 0 ? -1 : 1);
          wheelAcc = 0;
        }
      } else {
        cam.x += (e.deltaX * dpr) / cam.s;
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest(".modal")) return;
    const step = 40;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    switch (e.key) {
      case "ArrowLeft": cam.x -= step; break;
      case "ArrowRight": cam.x += step; break;
      case "ArrowUp": cam.y -= step; break;
      case "ArrowDown": cam.y += step; break;
      case "+": case "=": zoomAt(cx, cy, +1); break;
      case "-": case "_": zoomAt(cx, cy, -1); break;
      case "h": case "Home": home(); break;
      default: return;
    }
    e.preventDefault();
  });

  window.addEventListener("resize", resize);
  document.getElementById("home-btn").addEventListener("click", home);

  /* ---------- Render loop ---------- */

  function frame(now) {
    const t = now / 1000;
    const S = cam.s;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const tx = Math.round(canvas.width / 2 - cam.x * S);
    const ty = Math.round(canvas.height / 2 - cam.y * S);
    ctx.setTransform(S, 0, 0, S, tx, ty);
    const view = { x: -tx / S, y: -ty / S, w: canvas.width / S, h: canvas.height / S };

    W.drawGround(ctx, view);
    W.drawSign(ctx, t);

    const count = W.slotCount();
    for (let slot = 1; slot <= count; slot++) {
      const r = W.slotRect(slot);
      if (r.x + r.w < view.x - 60 || r.x > view.x + view.w + 60 || r.y + r.h + 24 < view.y || r.y > view.y + view.h) continue;
      V.renderPatch(ctx, slot, t);
    }

    W.drawAmbient(ctx, view, t);
    requestAnimationFrame(frame);
  }

  resize();
  home();
  requestAnimationFrame(frame);
  V.Loader.start();

  V.Engine = { cam, home, zoomAt };
})();
