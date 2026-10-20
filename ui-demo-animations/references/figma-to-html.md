# Figma screens to static HTML

Use the Figma MCP (`get_design_context`, `get_metadata`). Figma is read-only: never create or edit anything in it.

- Large frames (full 1920x1080 app pages) can exceed the ~100,000-character code limit and arrive truncated (the output is saved to a file). The missing tail is usually a right column or footer: fetch those child nodes by id with separate calls and merge them.
- Use `get_metadata` on a section to list frame ids and names; for a huge board it can fail or be too large, so search the saved output for `<frame id=... width="1920"` to list top-level screens.
- Flows (steps of one process) often sit as sibling frames named by state, e.g. "... (0/3)", "Approved by all (3/3)", "Sent to supplier". Pick the key states, not every variant.
- Asset URLs in the output are temporary and cannot always be downloaded. Replace icon constants with local icons of the same name, and for decorative vectors that cannot be fetched (chart lines, donuts) say so and draw them only if the user asks.
- Convert Tailwind output to scoped static CSS: compile with a scope class (`important: .scope`, preflight off), resolve `var(--x, fallback)` to the fallback, force the project font, add a scoped reset. Render to a static string with `renderToStaticMarkup`, then embed as a string constant plus a CSS file.
- Truncated JSX may need closing tags repaired before bundling.
- Preview each converted screen in a browser before wiring it in; the page text (`innerText`) is a quick completeness check when screenshots are flaky.
- If the user points to a prototype for animation ("see what animates when the page opens"), read the prototype source (hooks like animated values/series, entrance animations) and copy the behaviour: what counts up, what grows, how long.
