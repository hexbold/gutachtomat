#!/usr/bin/env tsx

/**
 * Generate Assessment Text from JSON
 *
 * This script reads an exported JSON file and generates the assessment text
 * using the same text generation logic as the web application.
 *
 * Usage:
 *   npm run generate-from-json <path-to-json-file>
 *
 * Example:
 *   npm run generate-from-json json-data/gutachten-formdata-1762178440224.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateAssessmentText } from '../src/lib/text-generation';
import * as FormTypes from '../src/lib/core/form-types';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function printHelp() {
  console.log(`
${colors.bright}Generate Assessment Text from JSON${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run generate-from-json <path-to-json-file> [options]

${colors.cyan}Example:${colors.reset}
  npm run generate-from-json test/data/gutachten-formdata-1762178440224.json
  npm run generate-from-json test/data/patient-001.json -- --output test/output/patient-001.md
  npm run generate-from-json test/data/patient-001.json -- --auto-name

${colors.cyan}Options:${colors.reset}
  --help, -h          Show this help message
  --output, -o <file> Write output to file instead of console
  --format <type>     Output format: markdown (default), json, both
  --auto-name         Auto-generate output filename based on input (saves to test/output/ dir)
  --output-dir <dir>  Output directory for auto-named files (default: test/output)

${colors.cyan}Auto-naming:${colors.reset}
  Input:  test/data/patient-001.json
  Output: test/output/patient-001.md (for markdown format)
          test/output/patient-001.json (for json format)
          test/output/patient-001.txt (for both format)
`);
}

function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let jsonFilePath: string | null = null;
  let outputFile: string | null = null;
  let format: 'markdown' | 'json' | 'both' = 'markdown';
  let autoName = false;
  let outputDir = 'test/output';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output' || arg === '-o') {
      outputFile = args[++i];
    } else if (arg === '--format') {
      const formatValue = args[++i];
      if (formatValue === 'markdown' || formatValue === 'json' || formatValue === 'both') {
        format = formatValue;
      } else {
        console.error(`${colors.red}Error:${colors.reset} Invalid format '${formatValue}'. Use: markdown, json, or both`);
        process.exit(1);
      }
    } else if (arg === '--auto-name') {
      autoName = true;
    } else if (arg === '--output-dir') {
      outputDir = args[++i];
    } else if (!arg.startsWith('--') && !jsonFilePath) {
      jsonFilePath = arg;
    }
  }

  if (!jsonFilePath) {
    console.error(`${colors.red}Error:${colors.reset} No JSON file specified`);
    printHelp();
    process.exit(1);
  }

  // Resolve path relative to project root
  const projectRoot = path.resolve(__dirname, '..');
  const absoluteJsonPath = path.resolve(projectRoot, jsonFilePath);

  // Check if file exists
  if (!fs.existsSync(absoluteJsonPath)) {
    console.error(`${colors.red}Error:${colors.reset} File not found: ${absoluteJsonPath}`);
    process.exit(1);
  }

  console.log(`${colors.cyan}Reading JSON file:${colors.reset} ${jsonFilePath}`);

  try {
    // Read and parse JSON file
    const jsonContent = fs.readFileSync(absoluteJsonPath, 'utf-8');
    const importedData = JSON.parse(jsonContent) as Partial<FormTypes.Form>;

    // Merge with initial form state to ensure all required fields exist
    const formData: FormTypes.Form = {
      ...FormTypes.initialFormState.formData,
      ...importedData,
    };

    console.log(`${colors.green}✓${colors.reset} JSON file loaded successfully`);
    console.log(`${colors.cyan}Generating assessment text...${colors.reset}\n`);

    // Generate text using the text generator
    const result = generateAssessmentText(formData);

    // Prepare output based on format
    let output = '';

    if (format === 'markdown' || format === 'both') {
      output += `${colors.bright}=== Generated Markdown Text ===${colors.reset}\n\n`;
      output += result.text;
      output += '\n\n';
    }

    if (format === 'json' || format === 'both') {
      output += `${colors.bright}=== Structured Content (JSON) ===${colors.reset}\n\n`;
      output += JSON.stringify(result.structure, null, 2);
      output += '\n';
    }

    // Auto-generate output filename if requested
    if (autoName && !outputFile) {
      const baseFilename = path.basename(jsonFilePath, '.json');
      let extension = '.txt';

      if (format === 'markdown') {
        extension = '.md';
      } else if (format === 'json') {
        extension = '.json';
      } else if (format === 'both') {
        extension = '.txt';
      }

      outputFile = path.join(outputDir, `${baseFilename}${extension}`);

      // Ensure output directory exists
      const absoluteOutputDir = path.resolve(projectRoot, outputDir);
      if (!fs.existsSync(absoluteOutputDir)) {
        fs.mkdirSync(absoluteOutputDir, { recursive: true });
      }
    }

    // Write to file or console
    if (outputFile) {
      const absoluteOutputPath = path.resolve(projectRoot, outputFile);

      // Remove ANSI color codes when writing to file
      const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '');

      fs.writeFileSync(absoluteOutputPath, cleanOutput, 'utf-8');
      console.log(`${colors.green}✓${colors.reset} Output written to: ${outputFile}`);
    } else {
      console.log(output);
    }

    console.log(`${colors.green}✓${colors.reset} Text generation completed successfully`);

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`${colors.red}Error:${colors.reset} Invalid JSON file`);
      console.error(error.message);
    } else if (error instanceof Error) {
      console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
      console.error(error.stack);
    } else {
      console.error(`${colors.red}Error:${colors.reset} Unknown error occurred`);
    }
    process.exit(1);
  }
}

main();