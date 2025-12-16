#!/usr/bin/env tsx

/**
 * Generate Random Test Cases
 *
 * This script generates random form data JSON files for testing purposes.
 * Each file contains a complete, valid form submission with randomly generated data.
 *
 * Usage:
 *   npm run generate-random-test-cases [options]
 *
 * Example:
 *   npm run generate-random-test-cases
 *   npm run generate-random-test-cases -- --count 20 --output-dir test/custom-data
 *   npm run generate-random-test-cases -- --minimal --verbose
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateRandomFormData } from '../src/lib/random-generators';
import { createMinimalJSON } from '../src/lib/utils/json-utils';

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

interface GenerationResult {
  filename: string;
  success: boolean;
  error?: string;
  filePath?: string;
  timestamp: number;
  size?: number;
}

interface GenerationStats {
  total: number;
  successful: number;
  failed: number;
  duration: number;
  totalSize: number;
}

function printHelp() {
  console.log(`
${colors.bright}Generate Random Test Cases${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run generate-random-test-cases [options]

${colors.cyan}Examples:${colors.reset}
  npm run generate-random-test-cases
  npm run generate-random-test-cases -- --count 20
  npm run generate-random-test-cases -- --output-dir test/my-test-data --minimal
  npm run generate-random-test-cases -- --count 50 --verbose

${colors.cyan}Options:${colors.reset}
  --help, -h              Show this help message
  --count <n>             Number of test cases to generate (default: 10)
  --output-dir <dir>      Output directory (default: test/random-test-data)
  --minimal               Generate minimal JSON (removes empty values)
  --verbose, -v           Show detailed progress
  --prefix <string>       Filename prefix (default: test-case)
  --summary-file <file>   Save generation summary to file

${colors.cyan}Output Structure:${colors.reset}
  test/random-test-data/
    ├── test-case-1234567890-0.json
    ├── test-case-1234567890-1.json
    ├── test-case-1234567890-2.json
    └── summary.json

${colors.cyan}Use Cases:${colors.reset}
  • Generate test data for regression testing
  • Create fixtures for integration tests
  • Populate test databases
  • Test text generation with varied inputs
  • Discover edge cases through randomization
`);
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateTestCase(
  outputDir: string,
  index: number,
  timestamp: number,
  prefix: string,
  minimal: boolean,
  verbose: boolean
): GenerationResult {
  const startTime = Date.now();
  const filename = `${prefix}-${timestamp}-${index}.json`;
  const filePath = path.join(outputDir, filename);

  if (verbose) {
    console.log(`${colors.dim}  Generating: ${filename}${colors.reset}`);
  }

  try {
    // Generate random form data
    const randomData = generateRandomFormData();

    // Optionally minimize the JSON
    const outputData = minimal ? createMinimalJSON(randomData) : randomData;

    // Convert to JSON string
    const jsonString = JSON.stringify(outputData, null, 2);

    // Write to file
    fs.writeFileSync(filePath, jsonString, 'utf-8');

    // Get file size
    const stats = fs.statSync(filePath);
    const duration = Date.now() - startTime;

    if (verbose) {
      const sizeStr = formatBytes(stats.size);
      console.log(`${colors.green}  ✓ Success${colors.reset} ${colors.dim}(${duration}ms, ${sizeStr})${colors.reset}`);
    }

    return {
      filename,
      success: true,
      filePath,
      timestamp: duration,
      size: stats.size,
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

function printSummary(results: GenerationResult[], stats: GenerationStats) {
  console.log(`\n${colors.bright}${colors.cyan}═══ Generation Summary ═══${colors.reset}\n`);

  console.log(`${colors.bright}Total files:${colors.reset}     ${stats.total}`);
  console.log(`${colors.green}Successful:${colors.reset}      ${stats.successful}`);
  if (stats.failed > 0) {
    console.log(`${colors.red}Failed:${colors.reset}          ${stats.failed}`);
  }
  console.log(`${colors.dim}Total duration:${colors.reset}  ${stats.duration}ms`);
  console.log(`${colors.dim}Total size:${colors.reset}      ${formatBytes(stats.totalSize)}\n`);

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

function saveSummaryFile(summaryPath: string, results: GenerationResult[], stats: GenerationStats) {
  const summary = {
    timestamp: new Date().toISOString(),
    stats,
    results: results.map(r => ({
      filename: r.filename,
      success: r.success,
      error: r.error,
      filePath: r.filePath,
      generationTime: r.timestamp,
      size: r.size,
    })),
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
}

function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let count = 10;
  let outputDir = 'test/random-test-data';
  let minimal = false;
  let verbose = false;
  let prefix = 'test-case';
  let summaryFile: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--count') {
      const countValue = parseInt(args[++i], 10);
      if (isNaN(countValue) || countValue < 1) {
        console.error(`${colors.red}Error:${colors.reset} Invalid count value. Must be a positive integer.`);
        process.exit(1);
      }
      count = countValue;
    } else if (arg === '--output-dir') {
      outputDir = args[++i];
    } else if (arg === '--minimal') {
      minimal = true;
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true;
    } else if (arg === '--prefix') {
      prefix = args[++i];
    } else if (arg === '--summary-file') {
      summaryFile = args[++i];
    }
  }

  // Resolve paths
  const projectRoot = path.resolve(__dirname, '..');
  const absoluteOutputDir = path.resolve(projectRoot, outputDir);

  // Print configuration
  console.log(`${colors.bright}${colors.cyan}Random Test Case Generator${colors.reset}\n`);
  console.log(`${colors.cyan}Configuration:${colors.reset}`);
  console.log(`  Count:        ${count}`);
  console.log(`  Output dir:   ${outputDir}`);
  console.log(`  Minimal JSON: ${minimal ? 'Yes' : 'No'}`);
  console.log(`  Prefix:       ${prefix}`);
  console.log('');

  // Create output directory
  ensureDirectoryExists(absoluteOutputDir);
  console.log(`${colors.green}✓${colors.reset} Output directory ready\n`);

  // Generate test cases
  console.log(`${colors.bright}Generating ${count} test case(s)...${colors.reset}\n`);
  const startTime = Date.now();
  const timestamp = Date.now();
  const results: GenerationResult[] = [];

  for (let i = 0; i < count; i++) {
    if (!verbose) {
      const progress = `[${i + 1}/${count}]`;
      process.stdout.write(`${colors.dim}${progress}${colors.reset} Generating test case ${i + 1}...`);
    }

    const result = generateTestCase(absoluteOutputDir, i, timestamp, prefix, minimal, verbose);
    results.push(result);

    if (!verbose) {
      const status = result.success
        ? `${colors.green}✓${colors.reset}`
        : `${colors.red}✗${colors.reset}`;
      const sizeStr = result.size ? ` (${formatBytes(result.size)})` : '';
      process.stdout.write(` ${status}${colors.dim}${sizeStr}${colors.reset}\n`);
    }
  }

  const totalDuration = Date.now() - startTime;

  // Calculate statistics
  const stats: GenerationStats = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    duration: totalDuration,
    totalSize: results.reduce((sum, r) => sum + (r.size || 0), 0),
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
    console.log(`${colors.dim}Summary saved to: ${path.join(outputDir, 'summary.json')}${colors.reset}\n`);
  }

  // Success message
  if (stats.failed === 0) {
    console.log(`${colors.green}${colors.bright}✓ All test cases generated successfully!${colors.reset}\n`);
  }

  // Exit with appropriate code
  process.exit(stats.failed > 0 ? 1 : 0);
}

main();
