# Changelog

All notable changes to this skill. Format follows [Keep a Changelog](https://keepachangelog.com), versions follow [semver](https://semver.org).

## [1.0.0] - 2026-10-20

First public release.

### Added
- Core rule: reproduce the provided design exactly; fill gaps only where something is missing and report every addition.
- Cursor choreography: move, hover, press, result; in-window cursor clamped to the visible area; scenes hand over after the slowest story; slide-out-left / enter-from-right scene change.
- Page micro-animations: reveal on scroll, count-up on view, sliding indicators, multi-state cross-fade with step chips; reduced-motion support.
- `scripts/figma_to_html.mjs`: converts Figma responses into scoped static HTML and CSS.
- `assets/`: story runner, cursor and scene-swap styles, scaled screen copy, count-up and cross-fade components.
- `references/`: scene engine, Figma conversion notes, browser verification notes, list of past mistakes.
- `evals/evals.json`: sample requests (not yet run through a formal benchmark).
