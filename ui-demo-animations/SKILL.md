---
name: ui-demo-animations
description: Build animated product-interface demos for landing pages and websites, where real app screens (from a Figma mockup or link) play out a scripted story with a moving cursor that hovers, clicks, opens dropdowns and modals, plus smooth scroll and micro-animations around them. Use whenever the user wants interface animations, an animated hero with app windows, a "show the product in action" section, cursor-driven demos, screen-to-screen transitions, or micro-animations on a landing page, or shares a Figma link/node of a screen to animate. Also use for Russian requests like "анимация интерфейса", "курсор нажимает", "микроанимации", "показать продукт на лендинге".
---

# UI demo animations

Turn real product screens into short, readable stories on a web page: a cursor moves, hovers, clicks, things open and change, then the story hands over to the next one. Plus quiet micro-animations around the page.

## The core rule: faithful first, inventive only for gaps

The point of showing real screens is that visitors see the actual product. Invented UI breaks that trust and the user will notice immediately (they have pushed back on made-up badges, extra cards and "confirmation" overlays that did not exist in their design).

1. **User gave a link, node, screenshot or exact request → reproduce exactly that.** Same layout, copy, icons, colors, sizes. No added elements, no rewording, no "improvements". If a frame is too big and arrives truncated, fetch the missing parts from sub-nodes of the same design rather than guessing.
2. **User wants something but did not provide it → fill the gap yourself**, in the visual language of their existing screens (their fonts, tokens, components, radii). Keep it minimal.
3. **Always report what you built yourself** in the final message, as a short list, so the user can check it. Anything not in the design and not requested is a gap-fill and must be named.
4. **Unsure whether something is wanted → leave it out and ask**, rather than add it.

Also keep text on the page honest: do not repeat the hero copy in later sections, and do not state numbers or claims the project has not supplied.

## Cursor choreography

The animated cursor lives inside the interface and tells the story. Do not confuse it with the user's real mouse cursor.

- Model a story as a list of steps: move to target → short hover (highlight the element) → press → result appears. The result must follow the press, never precede it.
- Move the cursor on eased paths with a duration proportional to distance; pause briefly (300-600 ms) at each target so the eye can follow.
- Show real states: hover color, pressed state, dropdown open, option highlighted, checkbox ticked, calendar day chosen, modal opening.
- Every window plays its own independent story. Windows may overlap in time, but each story runs once per cycle.
- Keep the cursor inside the visible area: when a target is off-screen, move the camera (pan/zoom the scene) instead of letting the cursor leave.
- After the slowest story finishes, wait about a second, then hand over to the next scene. Never swap scenes mid-story.
- Show a role or scene change as a slide: the old windows leave to the left, the new ones enter from the right, with opacity. Do not use blur filters or heavy will-change on large layers; they cause lag on the second round.
- Mobile: no dragging; one centred window with the animation. Windows should hug their content, no empty space inside.

If the user's own mouse can interact (dragging windows), use a small standard-sized hand cursor with a dark outline so it stays visible on any background. Never an oversized cursor.

## Page micro-animations

Original and domain-specific beats copied from other sites. Good defaults:

- Reveal on scroll: fade plus small rise, staggered by a CSS variable (`--d`), once only.
- Numbers count up when they scroll into view, and settle on the exact original text at the end. Make the effect idempotent (restore original text on cleanup) because React StrictMode runs effects twice in dev.
- Active-section indicators that slide between items (compute the position from the active element's offset and recompute on resize).
- Cross-fade between related screens (one flow, several states) with step chips the user can also click; run only while the block is on screen.
- Hover transitions about 200 ms with an ease-out curve; never `transition: all`.
- Respect `prefers-reduced-motion` everywhere (jump to the final state).
- Avoid decoration that looks machine-made: gradients, glows, sparkle icons, emoji. Minimal and calm.

Use IntersectionObserver thresholds low enough for tall elements (0.1-0.15); a threshold of 0.4 never fires for an element taller than 2.5 viewports.

## Workflow

1. **Collect the screens**: Figma links or files. Read `references/figma-to-html.md`, then run `scripts/figma_to_html.mjs` to turn each saved Figma response into scoped static HTML + CSS (setup and usage are in the script header).
2. **Inspect the project**: stack, tokens, fonts, existing components. Reuse what exists.
3. **Build the scene and stories**: start from `assets/story-runner.ts` (wait/cancel token, cursor clamped to its window, run-once scene runner with the hand-over rule), `assets/cursor.css` (virtual cursor with click ping) and `assets/role-swap.css`. `references/scene-engine.md` explains the stage, camera and windows.
4. **Page micro-animations and static screen copies**: `assets/ProductShot.tsx` (scaled static copy of a screen), `assets/CountUpAndCrossfade.tsx` and `assets/crossfade-flow.css` (count-up on view, multi-state crossfade with step chips). They are extracted from a working project: adapt names and imports.
5. **Verify**: follow `references/verification.md`; the pane and tools have known quirks that look like bugs. Check the second loop, mobile, reduced motion.
6. **Run the lessons check**: go through `references/lessons.md` (things this user rejected before) before declaring done.
7. **Report**: what was reproduced from the design, what you filled in yourself, what Figma did not provide, and temporary files to delete.

## Checklist before finishing

- Every visible element comes from the design or is listed as a gap-fill.
- No copy repeated from another section; no unsupported claims or mismatched numbers.
- Animations feel smooth on the second and later loops, not only the first.
- Type check / build passes (or you say what could not be run).
