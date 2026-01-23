# Scripts Documentation

## Table of Contents

1. [generate-text-from-json.ts](#generate-text-from-jsonts) - Generate text from a single JSON file
2. [batch-generate.ts](#batch-generatets) - Process multiple JSON files at once

---

## generate-text-from-json.ts

This script generates assessment text from a single exported JSON form data file.

### Purpose

The script allows you to:
- Generate assessment text offline without running the web application
- Process multiple JSON files in batch
- Export text in different formats (markdown, structured JSON)
- Save output to files for further processing

### Usage

#### Basic Usage

Generate markdown text from a JSON file and display it in the console:

```bash
npm run generate-from-json test/data/gutachten-formdata-1762178440224.json
```

#### Output to File

**Manual filename:**
```bash
npm run generate-from-json test/data/gutachten-formdata-1762178440224.json -- --output output.txt
```

**Auto-generate filename (recommended):**
```bash
npm run generate-from-json test/data/patient-001.json -- --auto-name
```

This automatically creates:
- Input: `test/data/patient-001.json`
- Output: `test/output/patient-001.md` (links filename to input)

**Custom output directory:**
```bash
npm run generate-from-json test/data/patient-001.json -- --auto-name --output-dir my-outputs
```

#### Output Formats

Choose different output formats:

**Markdown (default):**
```bash
npm run generate-from-json test/data/file.json -- --format markdown
```

**Structured JSON:**
```bash
npm run generate-from-json test/data/file.json -- --format json
```

**Both markdown and JSON:**
```bash
npm run generate-from-json test/data/file.json -- --format both
```

#### Combined Options

```bash
npm run generate-from-json test/data/file.json -- --format both --output result.txt
```

### Command Line Options

- `--help`, `-h` - Show help message
- `--output <file>`, `-o <file>` - Write output to file instead of console
- `--format <type>` - Output format: `markdown` (default), `json`, or `both`
- `--auto-name` - Auto-generate output filename based on input filename
- `--output-dir <dir>` - Output directory for auto-named files (default: `output`)

### Notes

- The script automatically merges your JSON data with the initial form state, so you don't need to include all fields in your JSON file
- Only the fields you've filled out in the form need to be in the JSON export
- The script uses the same text generation logic as the web application
- Color output is automatically removed when writing to files

### Examples

**Generate text for review:**
```bash
npm run generate-from-json test/data/patient-001.json
```

**Generate structured data for API integration:**
```bash
npm run generate-from-json test/data/patient-001.json -- --format json --output api-data.json
```

**Generate complete output for documentation:**
```bash
npm run generate-from-json test/data/patient-001.json -- --format both --output complete-report.txt
```

---

## batch-generate.ts

This script processes multiple JSON files in a directory and generates assessment text for all of them at once.

### Purpose

The batch processing script allows you to:
- Process all JSON files in a directory with a single command
- Generate outputs for multiple patient cases simultaneously
- Compare and analyze text generation across multiple cases
- Perform regression testing after text generation changes
- Get detailed statistics about processing success/failures

### Usage

#### Basic Usage

Process all JSON files in a directory:

```bash
npm run batch-generate json-data
```

This will:
- Find all `*.json` files in the `json-data` directory
- Generate assessment text for each one
- Save outputs to `test/batch-test/output/` directory
- Create a summary report

#### Specify Output Directory

```bash
npm run batch-generate json-data -- --output-dir my-output
```

#### Output Formats

Choose the output format for all files:

**Markdown files (.md):**
```bash
npm run batch-generate json-data -- --format markdown
```

**Structured JSON (.json):**
```bash
npm run batch-generate json-data -- --format json
```

**Both formats in one file (.txt):**
```bash
npm run batch-generate json-data -- --format both
```

#### Verbose Output

See detailed progress for each file:

```bash
npm run batch-generate json-data -- --verbose
```

or

```bash
npm run batch-generate json-data -- -v
```

#### File Pattern Matching

Process only specific files:

```bash
npm run batch-generate json-data -- --pattern "patient-*.json"
```

#### Custom Summary File

Save the processing summary to a specific location:

```bash
npm run batch-generate json-data -- --summary-file reports/summary.json
```

### Command Line Options

- `--help`, `-h` - Show help message
- `--output-dir <dir>` - Output directory (default: `batch-output`)
- `--format <type>` - Output format: `markdown` (default), `json`, or `both`
- `--pattern <glob>` - File pattern to match (default: `*.json`)
- `--verbose`, `-v` - Show detailed progress for each file
- `--summary-file <file>` - Save processing summary to specific file

### Output Structure

After running batch processing, you'll get:

```
test/batch-test/output/
├── patient-001.md
├── patient-002.md
├── patient-003.md
├── ...
└── summary.json
```

The `summary.json` file contains:
- Total files processed
- Success/failure counts
- Processing duration for each file
- Error messages for failed files
- Timestamp of the batch run

### Use Cases

#### 1. Quality Review Across Multiple Cases

Process all test cases and review outputs:

```bash
npm run batch-generate json-data -- --format markdown --output-dir review-output --verbose
```

Then manually review all markdown files in `review-test/output/` to identify:
- Grammatical issues
- Pronoun inconsistencies
- Formatting problems
- Missing information

#### 2. Regression Testing

Before making text generation changes:

```bash
# Generate baseline outputs
npm run batch-generate json-data -- --output-dir baseline-output

# Make your changes to text generation code...

# Generate new outputs
npm run batch-generate json-data -- --output-dir new-output

# Compare the two directories to see what changed
```

#### 3. Performance Testing

Check processing speed across many files:

```bash
npm run batch-generate json-data -- --verbose --summary-file perf-stats.json
```

Then analyze `perf-stats.json` to see processing times.

#### 4. Export for External Review

Generate markdown files for sharing with others:

```bash
npm run batch-generate json-data -- --format markdown --output-dir exports
```

### Examples

**Process all test cases:**
```bash
npm run batch-generate json-data
```

**Process specific patient files only:**
```bash
npm run batch-generate json-data -- --pattern "patient-*.json" --verbose
```

**Generate JSON outputs for API testing:**
```bash
npm run batch-generate test-cases -- --format json --output-dir api-test-data
```

**Full verbose run with custom summary:**
```bash
npm run batch-generate json-data -- --verbose --format both --output-dir full-reports --summary-file reports/batch-summary.json
```

### Error Handling

The script handles errors gracefully:
- If a JSON file is malformed, it logs the error and continues with other files
- If text generation fails for a file, the error is captured in the summary
- The script exits with code 1 if any files failed, code 0 if all succeeded
- Failed files are clearly marked in the summary output

### Performance

Processing speed depends on:
- Number of files
- Complexity of each case (amount of form data filled)
- Output format selected

Typical performance:
- Simple cases: ~50-100ms per file
- Complex cases: ~200-500ms per file
- 100 files: ~30-60 seconds total
