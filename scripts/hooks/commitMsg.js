#!/usr/bin/env node

/**
 * Git commit-msg hook
 * Enforces: one-line conventional commits, no mention of "claude"
 */

import { readFileSync } from 'node:fs';

const CONVENTIONAL_PATTERN =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+$/;

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('ERROR: No commit message file provided');
  process.exit(1);
}

const commitMsg = readFileSync(commitMsgFile, 'utf-8');
const firstLine = commitMsg.split('\n')[0];

// Check for "claude" (case-insensitive)
if (/claude/i.test(firstLine)) {
  console.error("ERROR: Commit message must not mention 'claude'");
  process.exit(1);
}

// Check conventional commit format
if (!CONVENTIONAL_PATTERN.test(firstLine)) {
  console.error('ERROR: Commit message must follow conventional commit format');
  console.error('');
  console.error('Format: type(scope): description');
  console.error('Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert');
  console.error('');
  console.error('Examples:');
  console.error('  feat: add user authentication');
  console.error('  fix(api): handle null response');
  console.error('  docs: update README');
  process.exit(1);
}

// Check for multi-line commit (only first line allowed)
const nonEmptyLines = commitMsg.split('\n').filter((line) => line.trim() !== '');
if (nonEmptyLines.length > 1) {
  console.error('ERROR: Commit message must be a single line');
  process.exit(1);
}

process.exit(0);
