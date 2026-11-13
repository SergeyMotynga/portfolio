# Portfolio frontend

## Project

- Communicate with the owner in Russian. Keep code identifiers in English.
- Stack: Astro, TypeScript, Markdown content collections, native CSS/SVG and browser animations. Preserve this stack and the existing components; do not introduce React, shadcn, Radix, Tailwind or an animation dependency just to follow a skill example.
- Before UI changes, read [the product specification](docs/portfolio-spec.md) and [the component and motion guide](docs/design-system.md). Before changing domain terms, read [GLOSSARY.md](GLOSSARY.md).
- Keep project descriptions and attribution separate from visual changes. Corporate content remains anonymised; use the publication policy in `src/lib/publication-policy.ts`.
- Track implementation in GitHub Issues. Continue the existing draft PR for this version; follow the owner's Git delivery workflows. Do not merge, mark ready or deploy without the owner's instruction.

## Frontend skills

Use the project copies below, including their references and scripts. Preserve each skill's invocation policy; a manual skill is not an automatic workflow.

| Skill | Apply when |
|---|---|
| [ui-ux-pro-max](.agents/skills/ui-ux-pro-max/SKILL.md) | Designing or changing UI, interaction, motion, responsive behaviour or accessibility |
| [design-system](.agents/skills/design-system/SKILL.md) | Changing tokens or component states; consult the existing component guide first |
| [design-taste-frontend](.agents/skills/design-taste-frontend/SKILL.md) | Building or polishing the landing page; preserve the owner's agreed design, content and motion requests |
| [prototype](.agents/skills/prototype/SKILL.md) | The owner requests a prototype; keep temporary prototypes outside the repository |
| [codebase-design](.agents/skills/codebase-design/SKILL.md) | Changing module boundaries or component interfaces |
| [domain-modeling](.agents/skills/domain-modeling/SKILL.md) | Changing domain terminology or architecture decisions |
| [diagnosing-bugs](.agents/skills/diagnosing-bugs/SKILL.md) | Diagnosing a defect or performance regression |
| [tdd](.agents/skills/tdd/SKILL.md) | Test-first development requested by the owner; visual edits do not require tests mirroring CSS |
| [code-review](.agents/skills/code-review/SKILL.md) | Reviewing substantive implementation before handover |
| [graphify](.agents/skills/graphify/SKILL.md) | Refreshing the code graph after substantive features or module changes |
| [writing-for-agents](.agents/skills/writing-for-agents/SKILL.md) | Editing this file or project skill instructions |
| [better-interface](.agents/skills/better-interface/SKILL.md) | Reviewing overall interface quality across the focused UI domains |
| [better-ui](.agents/skills/better-ui/SKILL.md) | Polishing surfaces, controls and motion; preserve deliberate project conventions |
| [better-typography](.agents/skills/better-typography/SKILL.md) | Text rendering, heading scales, wrapping and translated text |
| [better-colors](.agents/skills/better-colors/SKILL.md) | Colour tokens and contrast measurement |
| [better-accessibility](.agents/skills/better-accessibility/SKILL.md) | Keyboard, accessible names, focus, reduced motion and reflow |
| [better-layout](.agents/skills/better-layout/SKILL.md) | Alignment, grouping, responsive layout and translated content |
| [better-writing](.agents/skills/better-writing/SKILL.md) | Interface labels and feedback; project descriptions remain subject to owner review |
| [interface-review](.agents/skills/interface-review/SKILL.md) | Explicit owner request for interface review of a branch, PR or working changes |

## Checks and motion

- Run `npm run verify` for implementation changes: Astro check, production build and content/route/publication tests. Use Node.js 24.
- Check affected UI in a browser at desktop and narrow mobile sizes, including RU/EN, overflow, keyboard controls and motion fallbacks.
- Animation must never gate content or navigation. Keep the final readable state without JavaScript and under `prefers-reduced-motion`. Animate transforms and opacity; retain native scrolling and keyboard access.
- Do not commit temporary screenshots, logs, caches, audit reports or generated graph artifacts.

Frontend harness source: https://github.com/SergeyMotynga/codex-harness/tree/b83a97cb213edcd5323d59ac74d4751b1c0972a1/frontend — selected skill directories copied in full from commit `b83a97cb213edcd5323d59ac74d4751b1c0972a1`.

Landing skill source: https://github.com/leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8/skills/taste-skill — `design-taste-frontend` 2.5.1, complete resources and MIT licence. Its company-site templates, random palette/layout selection, fixed screen heights and default ban on scroll reveals do not replace this portfolio's explicit owner decisions. Preserve the requested name heading, dark/orange system, native scrolling, text reveals and custom Astro components. Use the host's supported browser workflow; do not launch a second browser automation stack just to run a skill checker.

UI skill source: https://github.com/jakubkrehel/skills/tree/a72290d140249813898ba8648becf6415abcb059/skills — eight focused UI/review skill directories copied in full from commit `a72290d140249813898ba8648becf6415abcb059`; manual invocation policies remain intact.
