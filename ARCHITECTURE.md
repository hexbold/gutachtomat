# Architecture

## Overview

Gutachtomat helps German psychotherapists create PTV3-compliant insurance assessment reports. The challenge: documenting 70+ data points (demographics, ICD-10 symptoms, AMDP clinical findings) while generating formal German text with correct grammar and gender-appropriate pronouns.

The user fills out a multi-step form and sees the generated report update in real-time.

---

## Project Structure

```
src/
├── app/
│   ├── gutachten-erstellen/           # Main application
│   │   ├── page.tsx                   # Entry point (wizard/form toggle)
│   │   └── _components/
│   │       ├── wizard/                # 7-step wizard flow
│   │       ├── form/                  # Full form view
│   │       └── shared/                # Modals, preview panel
│   ├── api/                           # API routes
│   ├── _components/                   # Shared app components
│   └── [faqs, tutorial, kontakt, ueber]  # Info pages
│
├── hooks/
│   └── useGutachtenForm.ts            # Central state + handlers
│
└── lib/
    ├── core/                          # Foundation
    │   ├── form-types.ts              # Type definitions
    │   ├── form-labels.ts             # Enum → display strings
    │   ├── form-reducer.ts            # State updates
    │   └── options/                   # Symptom/field option configs
    │
    ├── text-generation/               # Report construction
    │   ├── index.ts                   # Orchestrator
    │   ├── sections/                  # One file per chapter
    │   └── pronoun-utils.ts           # Gender-aware pronouns
    │
    ├── utils/                         # Shared utilities
    ├── random-generators/             # Test data generation
    └── data/                          # ICD-10 reference data
```

---

## Data Flow

```
User Input
    ↓
Component Handler
    ↓
useGutachtenForm (dispatch action)
    ↓
form-reducer (immutable update)
    ↓
Updated State
    ↓
text-generation/* (generates report)
    ↓
Live Preview Panel
```

---

## Entry Points

| To understand... | Start at |
|------------------|----------|
| Main app flow | `app/gutachten-erstellen/page.tsx` |
| State management | `hooks/useGutachtenForm.ts` |
| Text generation | `lib/text-generation/index.ts` |
| Type definitions | `lib/core/form-types.ts` |

---

## Key Decisions

### Wizard + Form modes

**Wizard** (default) shows one section at a time—reduces cognitive load when filling 70+ fields. **Form** is a debug view showing all fields at once for quickly modifying the complete data structure.

Both share the same state and components.

### Client-side text generation

Report generates entirely in the browser as the user types. No server round-trips.

Trade-off: More JavaScript shipped to client. But instant feedback is essential—users need to see exactly what their report will contain.

### Clerk for authentication

Clerk handles user authentication and account management. Chosen for GDPR compliance - no need to store sensitive user data ourselves. Clerk provides EU data residency and handles consent, data export, and deletion requests.

### Type-safe form state

**Goal:** Make invalid states impossible at compile time.

**Enums for domain values** (never include null in enum):
```typescript
enum Geschlecht { M = 'm', W = 'w', D = 'd' }
type GeschlechtField = Geschlecht | null;  // null = not selected
```

**Discriminated unions for dependent fields:**
```typescript
type Kinder =
  | null                           // not answered
  | { anzahl: 0 }                  // no children
  | { anzahl: 1; details: [...] }  // 1 child with details
```

TypeScript narrows the type automatically - when `anzahl > 0`, the `details` field exists.

All types defined in `lib/core/form-types.ts`.


---

## Related Docs

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — How to add new fields/sections
- [docs/patterns/card-selection-pattern.md](docs/patterns/card-selection-pattern.md) — CardSelection UI pattern
- [docs/style-guide.md](docs/style-guide.md) — German text generation rules
