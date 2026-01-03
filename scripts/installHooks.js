#!/usr/bin/env node

/**
 * Installs git hooks from scripts/hooks/ to .git/hooks/
 * Run automatically via npm postinstall
 */

import { copyFileSync, chmodSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const HOOKS_SOURCE_DIR = join(__dirname, 'hooks');
const HOOKS_TARGET_DIR = join(ROOT_DIR, '.git', 'hooks');

/**
 * Mapping from source file (camelCase) to git hook name (kebab-case)
 */
const HOOK_MAPPINGS = [{ source: 'preCommit.js', target: 'pre-commit' }];

const EXECUTABLE_MODE = 0o755;

function installHooks() {
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
