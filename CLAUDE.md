# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Documentation

| Document | Purpose |
|----------|---------|
| `ARCHITECTURE.md` | Project structure, data flow, key decisions |
| `docs/CONTRIBUTING.md` | How to add new fields/sections |
| `docs/patterns/card-selection-pattern.md` | CardSelection UI pattern for symptom modals |
| `docs/style-guide.md` | German text generation rules (Konjunktiv I, pronouns) |
| `test/TESTING.md` | Testing strategy and guidelines |

## Commands

```bash
pnpm install          # Install dependencies
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm run lint          # ESLint
```

## Code Guidelines

**Follow existing patterns:**
- Check how similar code is written before adding new code
- Use the type-safe pattern from `ARCHITECTURE.md` (enums, discriminated unions)
- Use `CardSelection` pattern for symptom UI (see `card-selection-pattern.md`)

**Prefer explicit over abstract:**
- Write visible, readable code - avoid unnecessary helper functions
- Inline small logic instead of creating abstractions for one-time use
- Keep conditionals visible in JSX rather than hiding in wrapper components

**Verify changes:**
- Run `npm run lint` after changes
- Check `git diff` to review what changed
- For text generation: generate sample output and verify German grammar

**Text generation:**
- Always use `getPronounsForGender()` from `pronoun-utils.ts` - never hardcode pronouns
- See `docs/style-guide.md` for Konjunktiv I and pronoun rules

## Quick Tips

**TypeScript:** Path aliases `@/*` maps to `./src/*`

**CSS:** Bei `text-justify` immer auch `hyphens-auto` und `lang="de"` hinzufügen

## Reference Files

For text generation work:
- `test/reference/gutachten-example.txt` - Complete example report
- `test/reference/sentence-generation-rules.md` - Grammar rules
- `src/lib/random-generators/TEXT-GENERATION-OPTIMIZATION.md` - QA workflow
