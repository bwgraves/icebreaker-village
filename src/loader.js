/*
 * Finds residents without a manifest: tries patches/01/patch.js,
 * patches/02/patch.js, ... in batches, and stops after a fully empty batch.
 * There's no shared list file, so people adding patches at the same time
 * never edit the same file.
 */
(function () {
  "use strict";
  const V = window.Village;

  const BATCH = 10;
  const MAX_SLOT = 99;
  const bust = location.protocol.startsWith("http") ? `?v=${Date.now()}` : "";

  function load(slot) {
    return new Promise((resolve) => {
      const nn = String(slot).padStart(2, "0");
      const s = document.createElement("script");
      s.src = `patches/${nn}/patch.js${bust}`;
      s.dataset.slot = String(slot);
      s.onload = () => {
        if (!V.patches.has(slot)) {
          // File exists but never called Village.patch(), most likely a syntax error.
          console.error(`[Icebreaker Village] patches/${nn}/patch.js loaded but didn't call Village.patch(). Check the console for a syntax error.`);
          V.patches.set(slot, { slot, spec: {}, broken: true, errors: {} });
        }
        resolve(true);
      };
      s.onerror = () => {
        s.remove();
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  async function start() {
    for (let first = 1; first <= MAX_SLOT; first += BATCH) {
      const slots = [];
      for (let i = first; i < first + BATCH && i <= MAX_SLOT; i++) slots.push(i);
      const found = await Promise.all(slots.map(load));
      if (!found.some(Boolean)) break;
    }
    const names = [...V.patches.values()].map((p) => `${p.slot}: ${p.spec.name || "?"}`);
    console.info(`[Icebreaker Village] ${names.length} resident(s) loaded.`, names);
  }

  V.Loader = { start };
})();
