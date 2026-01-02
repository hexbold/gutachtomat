# Gutachtomat

A web application for generating form-based compliant psychological assessment reports for clinical documentation.

<!-- Add screenshot: ![Screenshot](docs/screenshot.png) -->

## What It Does

- **Form-Based Reports** — Generates structured reports following the German Psychotherapist Procedure standard
- **Live Text Preview** — Real-time report generation as you fill out the form
- **ICD-10 Diagnoses** — Full diagnosis catalog with categorized symptom selection
- **AMDP Assessment** — Complete psychopathological findings structure
- **Professional German** — Automated formal medical language with correct grammar

## Tech Stack

- Next.js 15 (App Router) / React 19 / TypeScript
- Tailwind CSS v4 / Turbopack
- Clerk (GDPR-compliant authentication)
- Jest + React Testing Library

## Project Structure

```
src/
├── app/                          # Next.js pages & wizard UI
│   ├── gutachten-erstellen/      # Main form wizard
│   └── api/                      # Report generation endpoint
├── hooks/
│   └── useGutachtenForm.ts       # Form state management
└── lib/
    ├── core/                     # Types, reducer, config
    │   ├── form-types.ts         # TypeScript definitions
    │   ├── form-reducer.ts       # Generic field path reducer
    │   └── options/              # Symptom/Anamnese/Befund configs
    ├── random-generators/        # Test data generation
    ├── text-generation/          # Report text construction
    │   ├── sections/             # Per-chapter generators
    │   ├── pronoun-utils.ts      # German pronoun handling
    │   └── sentence-combiner.ts  # Natural text flow
    └── data/                     # ICD-10 reference data
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details.

## Disclaimer

This software is provided "as is" without warranty of any kind, express or implied. The author assumes no liability for any damages or consequences arising from the use of this software.

This is not a certified medical device. Any clinical documentation generated must be reviewed and verified by a qualified professional before use. Use at your own risk.

## License

© 2025 Lukas Bold. All rights reserved.
