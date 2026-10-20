// Minimal, framework-free version of the story engine used in the landing hero.
// A story is an async function; every await is a visible beat. `tok.dead = true` cancels everything (call it in effect cleanup).
export type Tok = { dead: boolean };
export const wait = (ms: number, tok: Tok) =>
  new Promise<void>((res, rej) => setTimeout(() => (tok.dead ? rej(new Error("cancelled")) : res()), ms));

/** Virtual cursor that lives inside one window and is clamped to that window's visible body. */
export function makeCursor(stage: HTMLElement, stageWidth: number, win: HTMLElement, cursor: HTMLElement, tok: Tok) {
  const k = () => stage.getBoundingClientRect().width / stageWidth; // stage is CSS-scaled
  const centerOf = (el: Element) => {
    const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), b = win.getBoundingClientRect(), m = 14;
    const x = (r.left + r.width / 2 - s.left) / k(), y = (r.top + r.height / 2 - s.top) / k();
    return {
      x: Math.min(Math.max(x, (b.left - s.left) / k() + m), (b.right - s.left) / k() - m),
      y: Math.min(Math.max(y, (b.top - s.top) / k() + m), (b.bottom - s.top) / k() - m),
    };
  };
  const place = (p: { x: number; y: number }) => (cursor.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`);
  return {
    show: () => cursor.classList.add("is-on"),
    goTo: async (el: Element, ms = 950) => { place(centerOf(el)); await wait(ms, tok); }, // a CSS transition on transform does the easing
    click: async () => { cursor.classList.add("is-click"); await wait(150, tok); cursor.classList.remove("is-click"); },
  };
}

/** Runs each window's story once; when the slowest finishes, pause, then hand over to the next scene. */
export function runScene(stories: { delay: number; run: () => Promise<void> }[], tok: Tok, onDone: () => void) {
  let finished = 0;
  for (const s of stories)
    (async () => {
      try {
        await wait(s.delay, tok);
        await s.run();
        if (++finished >= stories.length && !tok.dead) { await wait(900, tok); onDone(); }
      } catch (e) { if (!tok.dead) console.error("story stopped", e); }
    })();
}

/* Example story (beat order matters: move -> hover -> press -> RESULT):
   await cursor.goTo(selectEl, 1000);                          // move
   selectEl.classList.add("is-hover"); await wait(400, tok);   // hover
   await cursor.click(); selectEl.classList.add("is-open");    // press, then the result
   await wait(700, tok);
   const opt = menu.querySelector(".opt:nth-child(2)")!;
   await cursor.goTo(opt, 800); opt.classList.add("is-hover"); await wait(900, tok);  // hover the option before choosing
*/
