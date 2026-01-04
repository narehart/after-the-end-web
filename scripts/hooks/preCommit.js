#!/usr/bin/env node

/**
 * Pre-commit hook
 * 1. Runs typecheck
 * 2. Runs dead code detection
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// Project root is git root (standalone repo)
const GIT_ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();

// Global hooks directory (user's global git hooks)
const GLOBAL_HOOKS_DIR = join(homedir(), '.config', 'git', 'hooks');

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
runTypecheck();
runDeadCodeCheck();
runGlobalHook();
