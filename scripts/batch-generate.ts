#!/usr/bin/env tsx

/**
 * Batch Generate Assessment Text from JSON Files
 *
 * This script processes multiple JSON files in a directory and generates
 * assessment text for each one.
 *
 * Usage:
 *   npm run batch-generate <input-directory> [options]
 *
 * Example:
 *   npm run batch-generate json-data -- --output-dir output
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateAssessmentText } from '../src/lib/text-generation';
import * as FormTypes from '../src/lib/core/form-types';
import { deepMergeWithDefaults } from '../src/lib/utils/json-utils';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

interface ProcessingResult {
  filename: string;
  success: boolean;
  error?: string;
  outputPath?: string;
  timestamp: number;
}

interface BatchStats {
  total: number;
  successful: number;
  failed: number;
  duration: number;
}

function printHelp() {
  console.log(`
${colors.bright}Batch Generate Assessment Text from JSON Files${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run batch-generate <input-directory> [options]

${colors.cyan}Example:${colors.reset}
  npm run batch-generate test/data
  npm run batch-generate test/data -- --output-dir test/custom-output
  npm run batch-generate test/data -- --format both --verbose

${colors.cyan}Options:${colors.reset}
  --help, -h              Show this help message
  --output-dir <dir>      Output directory (default: test/batch-output)
  --format <type>         Output format: markdown (default), json, both
  --pattern <glob>        File pattern to match (default: *.json)
  --verbose, -v           Show detailed progress
  --summary-file <file>   Save processing summary to file

${colors.cyan}Output Structure:${colors.reset}
  test/batch-output/
    ├── patient-001.txt
    ├── patient-002.txt
    └── summary.json
`);
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function findJsonFiles(directory: string, pattern: string): string[] {
  const files = fs.readdirSync(directory);
  const regex = new RegExp(pattern.replace('*', '.*'));

  return files
    .filter(file => regex.test(file))
    .map(file => path.join(directory, file))
    .filter(filePath => fs.statSync(filePath).isFile());
}

function processJsonFile(
  jsonPath: string,
  outputDir: string,
  format: 'markdown' | 'json' | 'both',
  verbose: boolean
): ProcessingResult {
  const startTime = Date.now();
  const filename = path.basename(jsonPath);

  if (verbose) {
    console.log(`${colors.dim}  Processing: ${filename}${colors.reset}`);
  }

  try {
    // Read and parse JSON file
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const importedData = JSON.parse(jsonContent) as Partial<FormTypes.Form>;

    // Deep merge with initial form state to ensure all required fields exist
    // This handles minimal JSON where some fields might be missing
    const formData = deepMergeWithDefaults(FormTypes.initialFormState.formData, importedData);

    // Generate text
    const result = generateAssessmentText(formData);

    // Prepare output filename (remove .json extension)
    const baseFilename = path.basename(jsonPath, '.json');
    let outputContent = '';
    let outputExtension = '.txt';

    if (format === 'markdown') {
      outputContent = result.text;
      outputExtension = '.md';
    } else if (format === 'json') {
      outputContent = JSON.stringify(result.structure, null, 2);
      outputExtension = '.json';
    } else if (format === 'both') {
      outputContent = `=== Generated Markdown Text ===\n\n${result.text}\n\n`;
      outputContent += `=== Structured Content (JSON) ===\n\n`;
      outputContent += JSON.stringify(result.structure, null, 2);
      outputExtension = '.txt';
    }

    // Write output file
    const outputPath = path.join(outputDir, `${baseFilename}${outputExtension}`);
    fs.writeFileSync(outputPath, outputContent, 'utf-8');

    const duration = Date.now() - startTime;

    if (verbose) {
      console.log(`${colors.green}  ✓ Success${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`);
    }

    return {
      filename,
      success: true,
      outputPath,
      timestamp: duration,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (verbose) {
      console.log(`${colors.red}  ✗ Failed${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`);
      console.log(`${colors.red}    Error: ${errorMessage}${colors.reset}`);
    }

    return {
      filename,
      success: false,
      error: errorMessage,
      timestamp: duration,
    };
  }
}

function printSummary(results: ProcessingResult[], stats: BatchStats) {
  console.log(`\n${colors.bright}${colors.cyan}═══ Processing Summary ═══${colors.reset}\n`);

  console.log(`${colors.bright}Total files:${colors.reset}     ${stats.total}`);
  console.log(`${colors.green}Successful:${colors.reset}      ${stats.successful}`);
  if (stats.failed > 0) {
    console.log(`${colors.red}Failed:${colors.reset}          ${stats.failed}`);
  }
  console.log(`${colors.dim}Total duration:${colors.reset}  ${stats.duration}ms\n`);

  // Show failed files if any
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log(`${colors.red}Failed files:${colors.reset}`);
    failedResults.forEach(result => {
      console.log(`  ${colors.red}✗${colors.reset} ${result.filename}`);
      console.log(`    ${colors.dim}${result.error}${colors.reset}`);
    });
    console.log('');
  }

  // Show success rate
  const successRate = ((stats.successful / stats.total) * 100).toFixed(1);
  const rateColor = stats.failed === 0 ? colors.green : stats.failed < stats.successful ? colors.yellow : colors.red;
  console.log(`${rateColor}Success rate: ${successRate}%${colors.reset}\n`);
}

function saveSummaryFile(summaryPath: string, results: ProcessingResult[], stats: BatchStats) {
  const summary = {
    timestamp: new Date().toISOString(),
    stats,
    results: results.map(r => ({
      filename: r.filename,
      success: r.success,
      error: r.error,
      outputPath: r.outputPath,
      processingTime: r.timestamp,
    })),
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
}

function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let inputDirectory: string | null = null;
  let outputDir = 'test/batch-output';
  let format: 'markdown' | 'json' | 'both' = 'markdown';
  let pattern = '*.json';
  let verbose = false;
  let summaryFile: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output-dir') {
      outputDir = args[++i];
    } else if (arg === '--format') {
      const formatValue = args[++i];
      if (formatValue === 'markdown' || formatValue === 'json' || formatValue === 'both') {
        format = formatValue;
      } else {
        console.error(`${colors.red}Error:${colors.reset} Invalid format '${formatValue}'. Use: markdown, json, or both`);
        process.exit(1);
      }
    } else if (arg === '--pattern') {
      pattern = args[++i];
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true;
    } else if (arg === '--summary-file') {
      summaryFile = args[++i];
    } else if (!arg.startsWith('--') && !inputDirectory) {
      inputDirectory = arg;
    }
  }

  if (!inputDirectory) {
    console.error(`${colors.red}Error:${colors.reset} No input directory specified`);
    printHelp();
    process.exit(1);
  }

  // Resolve paths
  const projectRoot = path.resolve(__dirname, '..');
  const absoluteInputDir = path.resolve(projectRoot, inputDirectory);
  const absoluteOutputDir = path.resolve(projectRoot, outputDir);

  // Validate input directory
  if (!fs.existsSync(absoluteInputDir)) {
    console.error(`${colors.red}Error:${colors.reset} Input directory not found: ${absoluteInputDir}`);
    process.exit(1);
  }

  if (!fs.statSync(absoluteInputDir).isDirectory()) {
    console.error(`${colors.red}Error:${colors.reset} Input path is not a directory: ${absoluteInputDir}`);
    process.exit(1);
  }

  // Find JSON files
  console.log(`${colors.cyan}Searching for JSON files...${colors.reset}`);
  const jsonFiles = findJsonFiles(absoluteInputDir, pattern);

  if (jsonFiles.length === 0) {
    console.log(`${colors.yellow}No JSON files found matching pattern: ${pattern}${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.green}✓${colors.reset} Found ${jsonFiles.length} file(s)\n`);

  // Create output directory
  ensureDirectoryExists(absoluteOutputDir);
  console.log(`${colors.cyan}Output directory:${colors.reset} ${outputDir}\n`);

  // Process files
  console.log(`${colors.bright}Processing files...${colors.reset}\n`);
  const startTime = Date.now();
  const results: ProcessingResult[] = [];

  jsonFiles.forEach((jsonPath, index) => {
    if (!verbose) {
      const progress = `[${index + 1}/${jsonFiles.length}]`;
      const filename = path.basename(jsonPath);
      process.stdout.write(`${colors.dim}${progress}${colors.reset} ${filename}...`);
    }

    const result = processJsonFile(jsonPath, absoluteOutputDir, format, verbose);
    results.push(result);

    if (!verbose) {
      const status = result.success
        ? `${colors.green}✓${colors.reset}`
        : `${colors.red}✗${colors.reset}`;
      process.stdout.write(` ${status}\n`);
    }
  });

  const totalDuration = Date.now() - startTime;

  // Calculate statistics
  const stats: BatchStats = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    duration: totalDuration,
  };

  // Print summary
  printSummary(results, stats);

  // Save summary file if requested
  if (summaryFile) {
    const absoluteSummaryPath = path.resolve(projectRoot, summaryFile);
    saveSummaryFile(absoluteSummaryPath, results, stats);
    console.log(`${colors.green}✓${colors.reset} Summary saved to: ${summaryFile}\n`);
  } else {
    // Save default summary in output directory
    const defaultSummaryPath = path.join(absoluteOutputDir, 'summary.json');
    saveSummaryFile(defaultSummaryPath, results, stats);
  }

  // Exit with appropriate code
  process.exit(stats.failed > 0 ? 1 : 0);
}

main();
