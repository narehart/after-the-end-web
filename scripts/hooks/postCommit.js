#!/usr/bin/env node

/**
 * Post-commit hook: Index changed files for duplicate code detection
 *
 * Uses the dupe-checker RAG system to maintain an embedding index
 * of code chunks for detecting duplicate/similar code.
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DUPE_CHECKER_DIR = join(homedir(), '.claude-code-hooks', 'dupe-checker');
const PYTHON_PATH = join(DUPE_CHECKER_DIR, 'venv', 'bin', 'python');
const INDEX_SCRIPT = join(DUPE_CHECKER_DIR, 'index.py');

// Check if dupe-checker is installed
if (!existsSync(PYTHON_PATH) || !existsSync(INDEX_SCRIPT)) {
  // Silently skip if not installed
  process.exit(0);
}

// Get project root
function getProjectRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  } catch {
    process.exit(0);
  }
}

// Get files changed in the last commit
function getChangedFiles() {
  try {
    const output = execSync('git diff-tree --no-commit-id --name-only -r HEAD', {
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f && /\.(ts|tsx|js|jsx)$/.test(f));
  } catch {
    return [];
  }
}

// Get deleted files in the last commit
function getDeletedFiles() {
  try {
    const output = execSync('git diff-tree --no-commit-id --name-only --diff-filter=D -r HEAD', {
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f && /\.(ts|tsx|js|jsx)$/.test(f));
  } catch {
    return [];
  }
}

const projectRoot = getProjectRoot();
const changedFiles = getChangedFiles();
const deletedFiles = getDeletedFiles();

// Remove deleted files from index
for (const file of deletedFiles) {
  const filePath = join(projectRoot, file);
  spawnSync(PYTHON_PATH, [INDEX_SCRIPT, '--delete', filePath, '--project', projectRoot], {
    stdio: 'ignore',
  });
}

// Index changed files (added/modified)
for (const file of changedFiles) {
  if (deletedFiles.includes(file)) continue;

  const filePath = join(projectRoot, file);
  if (!existsSync(filePath)) continue;

  spawnSync(PYTHON_PATH, [INDEX_SCRIPT, '--file', filePath, '--project', projectRoot], {
    stdio: 'ignore',
  });
}

process.exit(0);
