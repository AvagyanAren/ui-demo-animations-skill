# Scene engine that worked (React + CSS)

- **Stage**: a fixed-size stage (e.g. 1360x700 wide, 900x600 narrow) scaled to the container with a ResizeObserver. All positions are in stage coordinates, so stories do not depend on screen size.
- **Windows**: absolutely positioned app windows (one main, optional left/right side windows). Side windows hug their content (measure body height with a ResizeObserver; animate height ~0.35 s).
- **Stories**: each window has its own story function. A helper such as `loop(delay, cursor, step)` runs the story once: it schedules steps with timeouts, moves the virtual cursor, toggles hover/pressed classes and then reveals the result. Keep a `finished` counter; when `finished >= need`, wait ~900 ms and call the scene-change handler.
- **Dropdowns and popovers**: build them as real markup from the design (option list, checkbox state, calendar grid) and open them via a class; hover the target option with an `:nth-child()` highlight before the click.
- **Camera**: translate/scale the stage so the active target is in view; cursor positions are clamped to the visible area.
- **Role/scene swap**: `leaving` state `"out" | "in" | false` toggles `.is-leaving` (translateX -140px, opacity 0) and `.is-entering` (translateX +140px, opacity 0, transition none). Flow: set "out" -> wait ~650 ms -> swap content and set "in" -> two animation frames -> clear. No blur.
- **Static copies** (for later page sections): a small component that scales a fixed-size HTML string to its container width (`transform: scale(width / naturalWidth)`) and measures its own height; mark it `pointer-events: none` and `aria-hidden` with a descriptive `role="img"` label.
