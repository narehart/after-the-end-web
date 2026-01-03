#!/usr/bin/env node

/**
 * Installs git hooks from scripts/hooks/ to .git/hooks/
 * Run automatically via npm postinstall
 */

import { execSync } from 'node:child_process';
import { copyFileSync, chmodSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const HOOKS_SOURCE_DIR = join(__dirname, 'hooks');

// Find git root
function getGitRoot() {
  try {
    const result = execSync('git rev-parse --show-toplevel', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    });
    return result.trim();
  } catch {
    return ROOT_DIR;
  }
}

const GIT_ROOT = getGitRoot();
const HOOKS_TARGET_DIR = join(GIT_ROOT, '.git', 'hooks');

/**
 * Mapping from source file (camelCase) to git hook name (kebab-case)
 */
const HOOK_MAPPINGS = [
  { source: 'preCommit.js', target: 'pre-commit' },
  { source: 'commitMsg.js', target: 'commit-msg' },
];

const EXECUTABLE_MODE = 0o755;

function installHooks() {
  // Set local hooksPath to override any global config
  try {
    execSync('git config --local core.hooksPath .git/hooks', { cwd: GIT_ROOT });
    console.log(`Set local git hooksPath to .git/hooks (git root: ${GIT_ROOT})`);
  } catch {
    console.warn('Warning: Could not set local git hooksPath');
  }

  // Ensure .git/hooks exists
  if (!existsSync(HOOKS_TARGET_DIR)) {
    mkdirSync(HOOKS_TARGET_DIR, { recursive: true });
  }

  for (const { source, target } of HOOK_MAPPINGS) {
    const sourcePath = join(HOOKS_SOURCE_DIR, source);
    const targetPath = join(HOOKS_TARGET_DIR, target);

    if (!existsSync(sourcePath)) {
      console.warn(`Warning: Hook source not found: ${sourcePath}`);
      continue;
    }

    copyFileSync(sourcePath, targetPath);
    chmodSync(targetPath, EXECUTABLE_MODE);
    console.log(`Installed git hook: ${target}`);
  }
}

installHooks();
