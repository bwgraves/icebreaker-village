/*
 * The welcome / instructions modal. Shown automatically on the first visit
 * (per browser), and any time via the "?" button.
 */
(function () {
  "use strict";
  const KEY = "icebreaker-village:intro-seen";
  const modal = document.getElementById("intro");
  const closeBtn = document.getElementById("intro-close");
  const helpBtn = document.getElementById("help-btn");
  const copyBtn = document.getElementById("copy-prompt");
  const prompt = document.getElementById("agent-prompt");

  function open() {
    modal.hidden = false;
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    // Nudge people towards where the checklist went.
    helpBtn.classList.remove("nudge");
    void helpBtn.offsetWidth;
    helpBtn.classList.add("nudge");
    try {
      localStorage.setItem(KEY, "1");
    } catch (e) {
      /* storage unavailable: the modal will just show again next time */
    }
  }

  let seen = false;
  try {
    seen = localStorage.getItem(KEY) === "1";
  } catch (e) {
    seen = false;
  }
  if (!seen) open();

  helpBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  copyBtn.addEventListener("click", () => {
    const text = prompt.textContent.trim();
    const done = () => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => selectPrompt());
    } else {
      selectPrompt();
    }
  });

  function selectPrompt() {
    const range = document.createRange();
    range.selectNodeContents(prompt);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
