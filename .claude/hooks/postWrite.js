#!/usr/bin/env node
// Post-write hook for Claude Code
// Runs after Write or Edit tool completes

import path from 'node:path';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const projectDir = process.env.CLAUDE_PROJECT_DIR;
if (!projectDir) process.exit(0);

process.chdir(projectDir);

function toRelativePath(filePath) {
  if (path.isAbsolute(filePath)) {
    return path.relative(projectDir, filePath);
  }
  return filePath;
}

function runCheck(command, args) {
  try {
    execSync(`${command} ${args.join(' ')}`, { stdio: 'pipe' });
  } catch (error) {
    process.stderr.write(error.stdout?.toString() || '');
    process.stderr.write(error.stderr?.toString() || '');
    process.exit(2);
  }
}

async function readStdin() {
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    return line;
  }
  return '';
}

const input = await readStdin();
const { tool_input: toolInput } = JSON.parse(input);
const filePath = toolInput.file_path;

// Run Prettier on supported files
if (/\.(js|jsx|ts|tsx|css|md)$/.test(filePath)) {
  runCheck('./node_modules/.bin/prettier', ['--write', filePath]);
}

// Run linters after formatting
if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
  runCheck('./node_modules/.bin/eslint', ['--fix', filePath]);
} else if (/\.css$/.test(filePath)) {
  runCheck('./node_modules/.bin/stylelint', ['--fix', filePath]);
}

// Check file/directory naming conventions (ls-lint requires relative paths)
runCheck('./node_modules/.bin/ls-lint', [toRelativePath(filePath)]);

process.exit(0);
