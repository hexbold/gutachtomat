# Text Generation Optimization Guide

This document describes the systematic process for optimizing and validating text generation in the psychological assessment report (Gutachten) system.

## Purpose

Text generation is critical to producing professional, grammatically correct, and stylistically appropriate German psychological reports. This guide provides a repeatable methodology for:
- Validating existing text generators
- Optimizing text quality and style
- Ensuring compliance with professional standards
- Catching systematic errors early

## When to Use This Process

Use this optimization workflow when:
- Creating new text generation functions
- Refactoring existing generators
- Fixing reported text quality issues
- Adding support for new sections/chapters
- Making systematic improvements to writing style

## The 5-Phase Optimization Workflow

### Phase 1: Generate Test Data

**Goal:** Create diverse test cases covering all possible form states

**Steps:**
1. Identify the minimal JSON needed for the section/chapter
2. Use existing generator functions from `src/lib/random-generators/`
3. Generate 50-100 test cases (adjust based on complexity)
4. Save to `test/{chapter-name}/test-cases.json`

**Example:**
```typescript
// For Kapitel 1 (demographics)
import { generateDemographics } from '@/lib/random-generators/demographics-generator';

const testCases = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  ...generateDemographics()
}));
```

**Why many cases?**
- Reveals edge cases (empty fields, unusual combinations)
- Tests ALL logic branches (different genders, statuses, etc.)
- Provides statistical confidence in quality

**File naming:**
```
test/{chapter-name}/
  ├── test-cases.json         # Input data
  └── generated-outputs.txt   # Generated text (Phase 2)
```

### Phase 2: Generate Text Outputs

**Goal:** Run text generation on all test cases to produce actual report text

**Steps:**
1. Create generation script in `test/{chapter-name}/`
2. Read test cases from Phase 1
3. For each case, generate ONLY the target section/chapter
4. Save outputs in clearly separated format
5. Include test case ID for traceability

**Output format:**
```
=== Test Case 1 (ID: 1) ===
Die Patientin sei 35 Jahre alt. Sie habe Mathematik studiert...

=== Test Case 2 (ID: 2) ===
Der Patient sei 42 Jahre alt. Er habe eine Berufsausbildung...
```

**Script structure:**
```typescript
import { generateAssessmentText } from '@/lib/text-generation';

testCases.forEach(testCase => {
  // Build minimal FormData
  const formData = { ...testCase };

  // Generate text
  const result = generateAssessmentText(formData);

  // Extract only the target chapter/section
  // Save to output file
});
```

### Phase 3: Analysis & Review

**Goal:** Systematically identify text quality issues

**Two-pronged approach:**

#### A. Automated Analysis
Create `test/{chapter-name}/analyze.ts` to catch systematic errors:

**Grammar checks:**
- ❌ Indicative verb forms: `ist`, `hat`, `arbeitet`, `wohnt`
  - Should be Konjunktiv I: `sei`, `habe`, `arbeite`, `wohne`
- ❌ Wrong perfect tense: `ist geboren`, `hat studiert`
  - Should be: `sei geboren worden`, `habe studiert`

**Pronoun checks:**
- ❌ Hardcoded pronouns: `Er `, `Sie `, `Ihm `, `Ihr `
  - Should use pronoun system from `pronoun-utils.ts`

**Style checks:**
- ❌ Colloquialisms or informal language
- ❌ Missing conjunctions between clauses
- ❌ Repetitive sentence patterns

**Example automated check:**
```typescript
const indicativeVerbs = [
  /\s(ist|sind|war|waren)\s/gi,
  /\s(hat|haben|hatte|hatten)\s/gi,
  /\s(arbeitet|wohnt|verdient|kommt)\s/gi
];

indicativeVerbs.forEach(pattern => {
  const matches = text.match(pattern);
  if (matches) {
    console.log(`Found indicative: ${matches.join(', ')}`);
  }
});
```

#### B. Manual Review
Review generated outputs against references:

**References:**
1. `test/reference/sentence-generation-rules.md` - Grammar & style rules
2. `test/reference/gutachten-example.txt` - Real professional example

**Review checklist:**
- [ ] Konjunktiv I used consistently
- [ ] Professional medical language
- [ ] Smooth sentence flow with conjunctions
- [ ] No hardcoded gender pronouns
- [ ] Proper temporal markers (aktuell, derzeit, z. Zt.)
- [ ] Direct quotes formatted correctly („ ")
- [ ] Third-person perspective maintained

**Create issue list:**
```
Issues found in {generator-name}.ts:

1. Line 42: Using "ist" instead of "sei"
2. Line 58: Hardcoded "Er" instead of pronoun system
3. Line 72: Missing conjunction, choppy sentence flow
4. Line 89: Colloquial "gut drauf" instead of professional term
```

### Phase 4: Fix Generators

**Goal:** Apply fixes systematically to text generation functions

**Process for each generator file:**

1. **Read current implementation**
   ```typescript
   // Read the generator file
   const generator = readFile('src/lib/text-generation/sections/{name}-generator.ts');
   ```

2. **Identify issues** (from Phase 3)
   - Note line numbers
   - Categorize by type (grammar, style, pronouns, etc.)

3. **Apply fixes systematically:**

   **Fix 1: Konjunktiv I**
   ```typescript
   // ❌ Before
   `${p.derDie} ist ${alter} Jahre alt`

   // ✅ After
   `${p.derDie} sei ${alter} Jahre alt`
   ```

   **Fix 2: Pronoun system**
   ```typescript
   // ❌ Before
   `Er arbeitet als ${berufsbezeichnung}`

   // ✅ After
   import { getPronounsForGender } from '../pronoun-utils';
   const p = getPronounsForGender(geschlechtId);
   `${p.er} arbeite als ${berufsbezeichnung}`
   ```

   **Fix 3: Sentence flow**
   ```typescript
   // ❌ Before
   `${p.derDie} sei ledig. ${p.er} habe keine Kinder.`

   // ✅ After
   `${p.derDie} sei ledig und habe keine Kinder.`
   ```

   **Fix 4: Professional terminology**
   ```typescript
   // ❌ Before
   `${p.er} fühle sich schlecht`

   // ✅ After
   `${p.er} fühle sich niedergeschlagen`
   ```

4. **Test on subset** (10-15 cases)
   - Re-run generation on small sample
   - Verify fixes applied correctly
   - Check for regressions

### Phase 5: Validate & Iterate

**Goal:** Confirm improvements and iterate if needed

**Steps:**
1. **Re-generate all outputs**
   - Run Phase 2 script again with fixed generators
   - Compare before/after outputs

2. **Run automated checks**
   - Should show reduction in errors
   - Quantify improvement (e.g., "Reduced indicative verbs from 45 to 2")

3. **Manual spot-check** (random 10-15 examples)
   - Read for naturalness and flow
   - Compare to reference example style
   - Check edge cases (empty fields, unusual combinations)

4. **Iterate if needed**
   - If issues remain, return to Phase 3
   - Focus on remaining problem areas
   - Document systematic patterns for future reference

## Best Practices

### Test Case Coverage

**Ensure test cases cover:**
- ✅ All gender options (affects pronouns)
- ✅ Empty/missing fields (edge cases)
- ✅ Minimum and maximum values
- ✅ All dropdown/checkbox options
- ✅ "Illogical" combinations (per docs/GENERATION-PRINCIPLES.md)

### Generator Design Principles

**DO:**
- ✅ Use Konjunktiv I for patient-reported information
- ✅ Use pronoun system (`getPronounsForGender()`)
- ✅ Build complex sentences with conjunctions
- ✅ Return empty array `[]` if no content (don't return placeholder text)
- ✅ Handle empty/null values gracefully

**DON'T:**
- ❌ Hardcode gender pronouns
- ❌ Use indicative mood for patient statements
- ❌ Return incomplete sentences
- ❌ Assume fields are always filled

### Documentation

**After optimization, document:**
1. Issues found and fixed (for learning)
2. Patterns to avoid in future generators
3. Examples of good vs. bad text
4. Update `sentence-generation-rules.md` if needed

## Example: Kapitel 1 Optimization

**Context:** Kapitel 1 combines 7 generators (alter, bildungsweg, beruf, family-status, wohnsituation, finanzielle-situation, krankschreibung) into a single paragraph.

**Phase 1:** Generate 50 demographic test cases
```bash
npx tsx test/kapitel1/generate-test-data.ts
# Output: test/kapitel1/test-cases.json (50 cases)
```

**Phase 2:** Generate text outputs
```bash
npx tsx test/kapitel1/generate-outputs.ts
# Output: test/kapitel1/generated-outputs.txt
```

**Phase 3:** Analyze
```bash
npx tsx test/kapitel1/analyze.ts
# Output: test/kapitel1/analysis-report.txt
```
- Automated: Found 23 instances of indicative verbs
- Manual: Identified choppy sentence flow in beruf-generator

**Phase 4:** Fix generators
- Fixed `alter-generator.ts` (ist → sei)
- Fixed `beruf-generator.ts` (added conjunctions)
- Fixed `krankschreibung-generator.ts` (hardcoded pronouns)

**Phase 5:** Validate
- Re-generated outputs: Indicative verbs reduced to 0
- Manual check: Sentences flow naturally
- ✅ Complete

## Tools & Scripts

**Standard scripts to create:**

```typescript
// test/{chapter-name}/generate-test-data.ts
// Generates test cases for the chapter

// test/{chapter-name}/generate-outputs.ts
// Runs text generation on test cases

// test/{chapter-name}/analyze.ts
// Analyzes generated outputs for quality issues
```

**How to run:**
```bash
# Phase 1: Generate test data
npx tsx test/{chapter-name}/generate-test-data.ts

# Phase 2: Generate outputs
npx tsx test/{chapter-name}/generate-outputs.ts

# Phase 3: Analyze
npx tsx test/{chapter-name}/analyze.ts
```

## References

- **Grammar rules:** `test/reference/sentence-generation-rules.md`
- **Example report:** `test/reference/gutachten-example.txt`
- **Generation principles:** `docs/GENERATION-PRINCIPLES.md`
- **Pronoun system:** `src/lib/text-generation/pronoun-utils.ts`

---

**Last Updated:** 2025-11-04
**Maintained by:** Lukas Bold
**Purpose:** Systematic methodology for ensuring high-quality German text generation in psychological assessment reports
