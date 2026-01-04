#!/usr/bin/env node

/**
 * Pre-commit hook
 * 1. Blocks commits if candidates/ contains component files
 * 2. Runs typecheck
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// Project root is git root (standalone repo)
const GIT_ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
const CANDIDATES_DIR = join(GIT_ROOT, 'src/components/candidates');
const COMPONENT_EXTENSIONS = ['.tsx', '.ts'];

// Global hooks directory (user's global git hooks)
const GLOBAL_HOOKS_DIR = join(homedir(), '.config', 'git', 'hooks');

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
    console.error('  1. Extract reusable elements → shared/');
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
    execSync('npm run typecheck', { stdio: 'inherit', cwd: GIT_ROOT });
    console.log('Typecheck passed.');
  } catch {
    console.error('');
    console.error('Typecheck failed. Commit blocked.');
    process.exit(2);
  }
}

/**
 * Run dead code detection
 */
function runDeadCodeCheck() {
  console.log('Running dead code detection...');

  try {
    execSync('npm run lint:dead', { stdio: 'inherit', cwd: GIT_ROOT });
    console.log('Dead code check passed.');
  } catch {
    console.error('');
    console.error('Dead code detected. Commit blocked.');
    process.exit(3);
  }
}

/**
 * Run global pre-commit hook if it exists
 */
function runGlobalHook() {
  const globalPreCommit = join(GLOBAL_HOOKS_DIR, 'pre-commit');

  if (!existsSync(globalPreCommit)) {
    return;
  }

  console.log('Running global pre-commit hook...');

  try {
    execSync(globalPreCommit, { stdio: 'inherit', cwd: GIT_ROOT });
  } catch {
    console.error('Global pre-commit hook failed.');
    process.exit(1);
  }
}

// Main
checkCandidates();
runTypecheck();
runDeadCodeCheck();
runGlobalHook();
