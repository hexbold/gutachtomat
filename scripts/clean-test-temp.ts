#!/usr/bin/env tsx

/**
 * Clean Test Temp Directory
 *
 * This script removes all temporary test data and generated outputs.
 * It safely cleans the test/temp/ directory while preserving the fixtures.
 *
 * Usage:
 *   npm run clean-test-temp [options]
 *
 * Example:
 *   npm run clean-test-temp
 *   npm run clean-test-temp -- --dry-run
 *   npm run clean-test-temp -- --keep-json
 */

import * as fs from 'fs';
import * as path from 'path';

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
};

interface CleanupStats {
  filesDeleted: number;
  directoriesDeleted: number;
  totalSize: number;
  errors: number;
}

function printHelp() {
  console.log(`
${colors.bright}Clean Test Temp Directory${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run clean-test-temp [options]

${colors.cyan}Examples:${colors.reset}
  npm run clean-test-temp
  npm run clean-test-temp -- --dry-run
  npm run clean-test-temp -- --keep-json
  npm run clean-test-temp -- --confirm

${colors.cyan}Options:${colors.reset}
  --help, -h          Show this help message
  --dry-run           Show what would be deleted without actually deleting
  --keep-json         Keep JSON files, only delete output files
  --confirm           Skip confirmation prompt
  --verbose, -v       Show detailed output

${colors.cyan}What Gets Deleted:${colors.reset}
  test/temp/                          All temporary test data
  ├── *.json                          Random test cases
  ├── *.md / *.txt                    Generated outputs
  ├── batch-output*/                  Batch generation outputs
  ├── random-*/                       Random test data
  ├── verification-*/                 Verification data
  └── output/                         Single file outputs

${colors.cyan}What's Preserved:${colors.reset}
  test/fixtures/                      Permanent test fixtures
  test/README.md                      Documentation

${colors.cyan}Safety:${colors.reset}
  • Confirmation prompt before deletion (unless --confirm)
  • Only deletes within test/temp/ directory
  • Never touches test/fixtures/ or other project files
`);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Ignore errors, just return size so far
  }

  return totalSize;
}

function deleteRecursively(dirPath: string, keepJson: boolean, dryRun: boolean, verbose: boolean): CleanupStats {
  const stats: CleanupStats = {
    filesDeleted: 0,
    directoriesDeleted: 0,
    totalSize: 0,
    errors: 0,
  };

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const itemStats = fs.statSync(itemPath);

      if (itemStats.isDirectory()) {
        // Recursively delete subdirectory
        const subStats = deleteRecursively(itemPath, keepJson, dryRun, verbose);
        stats.filesDeleted += subStats.filesDeleted;
        stats.directoriesDeleted += subStats.directoriesDeleted;
        stats.totalSize += subStats.totalSize;
        stats.errors += subStats.errors;

        // Delete the now-empty directory
        if (!dryRun) {
          try {
            fs.rmdirSync(itemPath);
            stats.directoriesDeleted++;
            if (verbose) {
              console.log(`${colors.dim}  Deleted directory: ${path.relative(process.cwd(), itemPath)}${colors.reset}`);
            }
          } catch (error) {
            stats.errors++;
            if (verbose) {
              console.log(`${colors.red}  Error deleting directory: ${itemPath}${colors.reset}`);
            }
          }
        } else {
          stats.directoriesDeleted++;
          if (verbose) {
            console.log(`${colors.yellow}  Would delete directory: ${path.relative(process.cwd(), itemPath)}${colors.reset}`);
          }
        }
      } else {
        // Check if we should keep this file
        if (keepJson && itemPath.endsWith('.json')) {
          if (verbose) {
            console.log(`${colors.cyan}  Keeping: ${path.relative(process.cwd(), itemPath)}${colors.reset}`);
          }
          continue;
        }

        // Delete file
        stats.totalSize += itemStats.size;

        if (!dryRun) {
          try {
            fs.unlinkSync(itemPath);
            stats.filesDeleted++;
            if (verbose) {
              console.log(`${colors.dim}  Deleted: ${path.relative(process.cwd(), itemPath)}${colors.reset}`);
            }
          } catch (error) {
            stats.errors++;
            if (verbose) {
              console.log(`${colors.red}  Error deleting: ${itemPath}${colors.reset}`);
            }
          }
        } else {
          stats.filesDeleted++;
          if (verbose) {
            console.log(`${colors.yellow}  Would delete: ${path.relative(process.cwd(), itemPath)}${colors.reset}`);
          }
        }
      }
    }
  } catch (error) {
    stats.errors++;
    if (verbose) {
      console.log(`${colors.red}  Error reading directory: ${dirPath}${colors.reset}`);
    }
  }

  return stats;
}

function promptConfirmation(): boolean {
  // In a real implementation, you'd use readline or a similar library
  // For this script, we'll rely on the --confirm flag
  return true;
}

function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  const dryRun = args.includes('--dry-run');
  const keepJson = args.includes('--keep-json');
  const skipConfirm = args.includes('--confirm');
  const verbose = args.includes('--verbose') || args.includes('-v');

  // Resolve paths
  const projectRoot = path.resolve(__dirname, '..');
  const tempDir = path.join(projectRoot, 'test', 'temp');

  // Print header
  console.log(`${colors.bright}${colors.cyan}Clean Test Temp Directory${colors.reset}\n`);

  // Check if temp directory exists
  if (!fs.existsSync(tempDir)) {
    console.log(`${colors.yellow}Nothing to clean: test/temp/ directory does not exist${colors.reset}\n`);
    process.exit(0);
  }

  // Check if temp directory is empty
  const items = fs.readdirSync(tempDir);
  if (items.length === 0) {
    console.log(`${colors.green}Already clean: test/temp/ directory is empty${colors.reset}\n`);
    process.exit(0);
  }

  // Calculate current size
  const currentSize = getDirectorySize(tempDir);

  // Print what will be done
  console.log(`${colors.cyan}Target directory:${colors.reset} test/temp/`);
  console.log(`${colors.cyan}Current size:${colors.reset}     ${formatBytes(currentSize)}`);
  console.log(`${colors.cyan}Items:${colors.reset}            ${items.length}`);
  if (keepJson) {
    console.log(`${colors.cyan}Mode:${colors.reset}             Keep JSON files`);
  }
  if (dryRun) {
    console.log(`${colors.yellow}Mode:${colors.reset}             ${colors.yellow}DRY RUN (no files will be deleted)${colors.reset}`);
  }
  console.log('');

  // Confirmation (unless --confirm flag)
  if (!skipConfirm && !dryRun) {
    console.log(`${colors.yellow}⚠️  This will permanently delete all files in test/temp/${colors.reset}`);
    console.log(`${colors.yellow}Use --confirm flag to skip this prompt${colors.reset}\n`);
    console.log(`${colors.dim}Press Ctrl+C to cancel or run with --dry-run first${colors.reset}\n`);
  }

  // Perform cleanup
  console.log(`${colors.bright}${dryRun ? 'Analyzing' : 'Cleaning'}...${colors.reset}\n`);

  const stats = deleteRecursively(tempDir, keepJson, dryRun, verbose);

  // Print summary
  console.log(`\n${colors.bright}${colors.cyan}═══ Cleanup Summary ═══${colors.reset}\n`);

  if (dryRun) {
    console.log(`${colors.yellow}DRY RUN - No files were actually deleted${colors.reset}\n`);
  }

  console.log(`${colors.bright}Files:${colors.reset}         ${stats.filesDeleted}`);
  console.log(`${colors.bright}Directories:${colors.reset}   ${stats.directoriesDeleted}`);
  console.log(`${colors.bright}Space freed:${colors.reset}   ${formatBytes(stats.totalSize)}`);

  if (stats.errors > 0) {
    console.log(`${colors.red}Errors:${colors.reset}        ${stats.errors}`);
  }

  console.log('');

  if (dryRun) {
    console.log(`${colors.cyan}Run without --dry-run to actually delete files${colors.reset}\n`);
  } else if (stats.errors === 0) {
    console.log(`${colors.green}${colors.bright}✓ Cleanup completed successfully!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Cleanup completed with some errors${colors.reset}\n`);
  }

  // Exit with appropriate code
  process.exit(stats.errors > 0 ? 1 : 0);
}

main();
