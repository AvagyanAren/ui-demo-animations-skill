# UI Demo Animations — a skill for Claude

Turn real app screens into short animated stories for your website: a cursor that moves, hovers and clicks, windows that open and change, smooth scene transitions, and quiet micro-animations around the page.

Built from a real landing-page project (a B2B tender platform) and the feedback that came with it.

*Русская версия — внизу.*

## What it does

- **Cursor-driven product demos.** Each window plays its own scripted story: move, hover, press, result. The cursor always stays inside the visible area, scenes hand over only after the slowest story ends, and the old scene slides out left while the new one enters from the right.
- **Real screens from Figma.** Includes a script that converts Figma `get_design_context` output into scoped static HTML and CSS, plus notes on large frames that arrive truncated and on assets that cannot be downloaded.
- **Page micro-animations.** Reveal on scroll, count-up numbers, sliding active-item indicators, multi-state cross-fades with step chips, hover transitions. Respects `prefers-reduced-motion`. No gradients, glows or emoji.
- **Faithful to your design.** If you give a link, a node or an exact request, the screen is reproduced exactly with nothing invented. If something you want is missing, the skill fills the gap in your visual style and lists everything it added, so you can check it.

## Install

1. Download this repository, or take the `ui-demo-animations/` folder.
2. In Claude, add it as a skill (zip the `ui-demo-animations` folder into a `.skill` file, or place the folder where your Claude app or Claude Code loads skills from).
3. Ask for an animated demo, for example:
   - "Here is the Figma link to the tasks screen. Animate it on the landing: the cursor opens a task and ticks the checklist. Don't add anything extra."
   - "Add micro-animations to this page, similar in feel to Attio but not a copy."

## What is inside

```
ui-demo-animations/
├── SKILL.md                      the rules and the workflow
├── scripts/
│   └── figma_to_html.mjs         Figma response -> static HTML + scoped CSS
├── assets/
│   ├── story-runner.ts           wait/cancel, in-window cursor, run-once scene runner
│   ├── cursor.css                virtual cursor with click ping
│   ├── role-swap.css             scene change: leave left, enter from right
│   ├── ProductShot.tsx           scaled static copy of a screen
│   ├── CountUpAndCrossfade.tsx   count-up on view, multi-state cross-fade
│   └── crossfade-flow.css
├── references/
│   ├── scene-engine.md           stage, windows, camera, scene swap
│   ├── figma-to-html.md          getting complete screens out of Figma
│   ├── verification.md           how to test animations in a browser pane
│   └── lessons.md                mistakes to check for before saying "done"
└── evals/evals.json              sample prompts for trying the skill
```

The code in `assets/` is extracted from a working React + TypeScript project. Treat it as a starting point and adapt names and imports.

## Using the converter

```
mkdir work && cd work
npm i esbuild react react-dom tailwindcss@3.4.17 postcss heroicons@2.2.0
cp ../ui-demo-animations/scripts/figma_to_html.mjs .
node figma_to_html.mjs saved-figma-response.json my-screen my-scope
```

Output goes to `out/my-screen.html` and `out/my-screen.css`. The font is forced to Manrope inside the script; search for `Manrope` to change it.

## Notes

- Figma is treated as read-only; the skill only reads from it.
- Decorative vectors that Figma does not export (chart lines, donuts) stay blank; the skill reports them instead of guessing.
- The sample prompts in `evals/` have not been run through a formal benchmark yet.

---

## По-русски

**UI Demo Animations** — skill для Claude, который превращает реальные экраны приложения в короткие анимированные истории для сайта: курсор сам двигается, наводится и нажимает, окна открываются и меняются, сцены плавно сменяют друг друга, а вокруг работают спокойные микроанимации.

Главное правило: если вы дали ссылку на макет, узел Figma или точный запрос, экран воспроизводится строго как есть, без выдумок. Если чего-то не хватает, skill достраивает это в вашем стиле и перечисляет всё, что добавил сам.

Установка: скачайте репозиторий, возьмите папку `ui-demo-animations/` и подключите её как skill в Claude. Дальше просто просите: «вот ссылка на экран из Figma, анимируй его на лендинге», «добавь микроанимации на страницу».
