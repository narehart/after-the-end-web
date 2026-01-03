#!/usr/bin/env node

/**
 * Pre-commit hook
 * 1. Blocks commits if candidates/ contains component files
 * 2. Runs typecheck
 */

import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CANDIDATES_DIR = 'src/components/candidates';
const COMPONENT_EXTENSIONS = ['.tsx', '.ts'];

/**
 * Recursively finds all component files in a directory
 */
function findComponentFiles(dir) {
  const files = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findComponentFiles(fullPath));
      } else if (COMPONENT_EXTENSIONS.some((ext) => entry.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist, return empty
  }

  return files;
}

/**
 * Check for files in candidates directory
 */
function checkCandidates() {
  const candidateFiles = findComponentFiles(CANDIDATES_DIR);

  if (candidateFiles.length > 0) {
    console.error('');
    console.error(`Cannot commit: ${CANDIDATES_DIR} contains files.`);
    console.error('');
    console.error('Components in candidates/ must be decomposed:');
    console.error('  1. Extract reusable elements → primitives/');
    console.error('  2. Compose feature component → features/');
    console.error('  3. Delete from candidates/');
    console.error('');
    console.error('Files found:');
    for (const file of candidateFiles) {
      console.error(`  - ${file}`);
    }
    console.error('');
    process.exit(1);
  }
}

/**
 * Run typecheck
 */
function runTypecheck() {
  console.log('Running typecheck...');

  try {
    execSync('npm run typecheck', { stdio: 'inherit' });
    console.log('Typecheck passed.');
  } catch {
    console.error('');
    console.error('Typecheck failed. Commit blocked.');
    process.exit(2);
  }
}

// Main
checkCandidates();
runTypecheck();
