# Lessons from real feedback (what the user pushed back on)

Treat each as a check to run before saying "done".

- **Invented UI**: an "approved" overlay and a decision card that were not in the design were rejected ("what is this?"). Only the design's elements, or listed gap-fills.
- **Repeating copy**: a section title that restated the hero headline was called out. Compare every heading with the hero.
- **Clear meaning, unclear presentation**: a 2x5 grid of tiny steps with "1 · 3 min" labels read as a confusing block. Fix presentation (tabs by role, four large numbered steps) before touching the words.
- **Label vs content mismatch**: "28 categories" above ten visible items. If a number is shown, either show everything, add "show all N", or drop the number.
- **Alignment bugs in sliding indicators**: a bar offset by the container's own padding. Verify with measured coordinates, not by eye.
- **Wrong elements called "cursor"**: the user meant the animated in-scene cursor (moves, clicks), not the real mouse hand. Ask or restate when a term can mean two things.
- **Oversized or invisible real cursor**: keep the drag hand 20px with a dark outline.
- **Scene swaps mid-story and lag on loop two**: swap only after the slowest story; no blur; no will-change on big layers.
- **Empty space inside windows**: windows hug their content.
- **Mobile**: no drag, one centred animated window.
- **Truncated Figma frames** silently lose the right column: compare the render with the screenshot and fetch missing sub-nodes.
- **Background colour**: confirm exact values (#ffffff) rather than "white-ish" tokens.
- **Silent git failure**: a script that swallowed a failed commit (no author configured) then pushed nothing. Set `user.name/email` and show real output.
