# UI Demo Animations

**Version 1.0.0** · [Changelog](CHANGELOG.md)

**A skill for Claude that turns real app screens into short animated product demos for your website.**

A cursor moves across your interface, opens a dropdown, ticks a checkbox, presses a button, and the screen reacts. Around it, the page gets calm micro-animations: elements fade in as you scroll, numbers count up, an active menu item slides to the next one.

*Русская версия — [ниже](#по-русски).*

---

## Who is this for

- Designers and founders who have screens in **Figma** and want a landing page that shows the product in action, not just screenshots.
- Developers who build such pages with React/CSS and want Claude to follow the same rules every time.

You do not need to know animation tools. You describe what you want, give a Figma link, and Claude does the rest following the skill.

## What you get

| You ask for | Claude builds |
|---|---|
| "Animate this screen on the landing" + a Figma link | The exact screen with a scripted cursor story: move, hover, press, result |
| "Show buyer and supplier views" | Several windows playing their own stories, then a smooth hand-over to the next scene |
| "Add micro-animations" | Reveal on scroll, count-up numbers, sliding indicators, cross-fades between states |
| "Show how a contract goes from approval to sent" | Real frames of each state, cross-fading with clickable step chips |

## The one rule that matters

> **What you provide is reproduced exactly. Only what is missing is invented, and Claude tells you what it invented.**

- You give a Figma link, a node or an exact request: the screen is built as designed. Same layout, texts, icons, colors. Nothing added, nothing reworded.
- You ask for something but did not provide it: Claude fills the gap in the style of your existing screens, keeps it minimal, and lists it at the end so you can check it.
- Not sure if something is wanted: Claude leaves it out and asks.

This rule exists because made-up interface elements break trust: visitors think they are seeing the real product.

## How an animation story works

Every story is a chain of small beats in a fixed order:

1. The cursor **moves** to an element.
2. The element is **highlighted** (hover).
3. The cursor **presses**.
4. Only then does the **result** appear (a dropdown opens, a box gets ticked, a modal shows).

Other principles built into the skill:

- Each window plays its own story, independently of the others.
- The cursor never leaves the visible area; the view follows it.
- The scene changes only after the **slowest** story has finished, never in the middle of one.
- Old windows slide out to the left, new ones enter from the right.
- On phones: one centered window, no dragging.
- Everything respects `prefers-reduced-motion`.
- No gradients, glows, sparkle icons or emoji. Minimal and calm.

## Install

Pick whichever is easiest.

### Option 1. Terminal (works with Claude Code and other agents that support skills)

```
npx skills add AvagyanAren/ui-demo-animations-skill
```

Add `-g` to install it for all your projects instead of the current one:

```
npx skills add AvagyanAren/ui-demo-animations-skill -g
```

This uses the open [`skills` CLI](https://skills.sh/docs/cli). You need Node.js installed.

### Option 2. Claude app

1. Download `ui-demo-animations.skill` from this repository.
2. Open the file in the Claude app. It shows a card with a **Save skill** button.
3. Click **Save skill**.

The button appears only if your organization allows creating skills.

### Option 3. Manually, for Claude Code

```
git clone https://github.com/AvagyanAren/ui-demo-animations-skill.git
cp -r ui-demo-animations-skill/ui-demo-animations ~/.claude/skills/
```

Use `.claude/skills/` inside a project instead of `~/.claude/skills/` if you want it for that project only.

## How to use it

You do not need to call the skill by name. Just ask in plain words, in English or Russian. Examples:

- *"Here is the Figma link to the tasks screen: [link]. Animate it in a block on the landing: the cursor opens a task, ticks the checklist, changes the status. Don't add anything extra."*
- *"Show our dashboard in the hero: buyer and supplier windows, cursor moving and clicking, then the scene switches to the other role."*
- *"Add micro-animations to this page, similar in feel to Attio, but not a copy."*
- *"Here are three Figma frames of a contract: approval, approved, sent. Show them as one flow."*

Tips for better results:

- Give **links to specific Figma frames**, not the whole file.
- Say clearly what must **not** change ("don't add anything extra") or what you want Claude to decide itself.
- If a screen is large and part of it is missing from the result, say so; Claude can fetch the missing parts from the same design.

## What is inside

```
ui-demo-animations/
├── SKILL.md                      the rules and the workflow Claude follows
├── scripts/
│   └── figma_to_html.mjs         turns a Figma response into static HTML + CSS
├── assets/                       starting code taken from a real project
│   ├── story-runner.ts           waits with cancel, in-window cursor, scene runner
│   ├── cursor.css                the animated cursor and its click ripple
│   ├── role-swap.css             scene change: leave left, enter from right
│   ├── ProductShot.tsx           a scaled, static copy of a screen
│   ├── CountUpAndCrossfade.tsx   count-up on scroll, cross-fade between states
│   └── crossfade-flow.css
├── references/
│   ├── scene-engine.md           how the stage, windows, camera and swaps work
│   ├── figma-to-html.md          getting complete screens out of Figma
│   ├── verification.md           how to test animations without false alarms
│   └── lessons.md                mistakes to check for before saying "done"
└── evals/evals.json              sample requests for trying the skill
```

The code in `assets/` comes from a working React + TypeScript project. Treat it as a starting point and adapt names and imports to your own.

## Converting Figma screens yourself (optional)

Claude does this for you, but you can also run the converter by hand:

```
mkdir work && cd work
npm i esbuild react react-dom tailwindcss@3.4.17 postcss heroicons@2.2.0
cp ../ui-demo-animations/scripts/figma_to_html.mjs .
node figma_to_html.mjs saved-figma-response.json my-screen my-scope
```

You get `out/my-screen.html` and `out/my-screen.css`. The font is set to Manrope inside the script; search for `Manrope` to change it.

## Versions

This project uses [semantic versioning](https://semver.org): `MAJOR.MINOR.PATCH`. See [CHANGELOG.md](CHANGELOG.md) for what changed. To install a specific version, use its tag, for example `npx skills add AvagyanAren/ui-demo-animations-skill#v1.0.0` (if your CLI version does not support tags, download that release from the Releases page).

## Good to know (limits)

- **Figma is read-only.** The skill only reads from it and never changes your file.
- **Very large frames** can arrive cut off from Figma (the right column or the bottom is missing). The skill knows how to fetch those parts separately, but it is worth checking the result against your design.
- **Decorative vectors** that Figma does not export (chart lines, donut charts) come out blank. The skill reports this instead of guessing; draw them separately if you need them.
- **Not formally benchmarked.** The sample requests in `evals/` have not been through an automated comparison yet. The skill was shaped by real feedback on one project, so expect to tune it on yours.

## FAQ

**Will it invent screens that are not in my design?**
Not when you provide the design. Anything it has to invent is listed at the end of its answer.

**Does it only work with Figma?**
Figma is the main source, but screenshots or your own HTML screens work too. The conversion script is only for Figma.

**Does it need React?**
The bundled starting code is React + TypeScript. The ideas (story order, cursor rules, scene hand-over) apply to any stack.

**Can I change the rules?**
Yes. `SKILL.md` is a plain text file. Edit it and keep it short: every extra rule dilutes the main one.

---

## По-русски

### Что это

**UI Demo Animations** — skill для Claude, который превращает реальные экраны вашего приложения в короткие анимированные демо для сайта. По интерфейсу двигается курсор: открывает выпадающий список, ставит галочку, нажимает кнопку, и экран реагирует. Вокруг страница получает спокойные микроанимации: элементы появляются при скролле, числа считаются, индикатор активного пункта плавно переезжает.

### Для кого

Для дизайнеров и основателей, у которых экраны в **Figma**, и они хотят лендинг, где продукт показан в действии, а не на скриншотах. И для разработчиков, которым нужно, чтобы Claude каждый раз следовал одним и тем же правилам.

### Главное правило

> **Что вы дали, воспроизводится в точности. Выдумывается только то, чего не хватает, и Claude честно говорит, что именно он добавил.**

- Дали ссылку на макет, узел Figma или точный запрос: экран делается строго по макету, ничего не добавляется и не переписывается.
- Просите то, чего в макете нет: Claude достраивает в стиле ваших экранов, минимально, и перечисляет добавленное в конце.
- Не уверен, нужно ли: не добавляет и спрашивает.

### Как устроена анимация

Каждая история — цепочка шагов в строгом порядке: курсор **подходит** к элементу, элемент **подсвечивается**, курсор **нажимает**, и только потом появляется **результат**. Каждое окно играет свою историю независимо, курсор не выходит за видимую область, сцена меняется только после самой медленной истории. Старые окна уезжают влево, новые приходят справа. На телефоне одно окно по центру без перетаскивания. Уважается `prefers-reduced-motion`. Без градиентов, свечения и эмодзи.

### Установка

**Терминал** (Claude Code и другие агенты со skills; нужен Node.js):

```
npx skills add AvagyanAren/ui-demo-animations-skill
```

С флагом `-g` skill установится для всех проектов.

**Приложение Claude:** скачайте `ui-demo-animations.skill` из репозитория, откройте файл в приложении и нажмите «Save skill» на появившейся карточке (кнопка есть, если организация разрешает создавать skills).

**Вручную для Claude Code:** положите папку `ui-demo-animations/` в `~/.claude/skills/` (или в `.claude/skills/` внутри проекта).

### Как пользоваться

Называть skill не нужно, просто пишите задачу:

- «Вот ссылка на экран задач из Figma: [ссылка]. Анимируй в блоке на лендинге: курсор открывает задачу, ставит галочку, меняет статус. Ничего лишнего не добавляй».
- «Покажи в Hero наш кабинет: окна покупателя и поставщика, курсор двигается и нажимает, потом сцена переключается на другую роль».
- «Добавь микроанимации на страницу, как у Attio по ощущению, но не копию».

Советы: давайте ссылки на **конкретные кадры**, а не на весь файл; прямо пишите, что **нельзя** менять; если часть большого экрана пропала, скажите, Claude докачает недостающее из того же макета.

### Ограничения

Figma только читается, файл не меняется. Очень большие кадры могут прийти обрезанными, skill умеет докачивать части, но результат стоит сверить с макетом. Декоративные векторы, которые Figma не отдаёт (линии графиков, бублики), остаются пустыми, и skill об этом сообщает. Автоматического сравнения качества пока не было: skill сформирован по реальным замечаниям на одном проекте, на вашем его придётся донастраивать.
