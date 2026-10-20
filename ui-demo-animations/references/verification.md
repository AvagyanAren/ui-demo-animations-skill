# Verifying animations in a browser pane

The tooling is flaky in specific, repeatable ways. Know them so you do not "fix" bugs that are not there.

- **Screenshots can time out or come back blank** right after navigation. Retry once; if it persists, measure instead: `innerText` for content completeness, `getBoundingClientRect()` for alignment, class lists (`is-on`, `is-active`) for state.
- **A hidden browser pane throttles timers and `requestAnimationFrame`**, so intervals and count-ups look stuck. Check `document.visibilityState` and test rAF (`await new Promise(r => requestAnimationFrame(r))`) before suspecting your code.
- **Emulated viewports** change what IntersectionObserver sees; sticky side navs that hide under a breakpoint report zero sizes. Resize to a wide viewport (e.g. 1440x900) to test desktop-only parts, and reset the viewport (`preset: desktop`) afterwards.
- **Instant scroll** (`scrollIntoView`) skips reveal animations; set `scroll-behavior: auto` and wait 1-2 s after jumping before reading state.
- **React StrictMode** runs effects twice in dev. Any effect that mutates DOM text or classes must restore the original in cleanup, or the second run sees the mutated state (a count-up that read "0" as its target and never ran).
- **IntersectionObserver thresholds**: tall elements never reach 0.4 visible; use 0.1-0.15.
- Run the type check after every change. A sandbox may not be able to run the bundler (platform-specific node_modules); say so rather than claim a full build passed.
- Check the second and third loop of a story, not only the first: lag and leftover state show up there.
- Temporary preview pages you add to `public/` must be listed for deletion in the final message.
