#!/usr/bin/env node

/**
 * Pre-PR creation hook
 * Blocks PR creation if the body contains "🤖 Generated with Claude Code"
 */

const FORBIDDEN_TEXT = '🤖 Generated with Claude Code';

function parseGhPrCommand(command) {
  if (!/gh\s+pr\s+create/.test(command)) {
    return null;
  }

  const bodyMatch = command.match(/--body\s+["']?\$\(cat\s+<<['"]?EOF['"]?\s*([\s\S]*?)\s*EOF\s*\)["']?/);
  if (bodyMatch) {
    return bodyMatch[1];
  }

  const simpleBodyMatch = command.match(/--body\s+["']([^"']+)["']/);
  if (simpleBodyMatch) {
    return simpleBodyMatch[1];
  }

  return '';
}

async function readStdin() {
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function main() {
  const input = await readStdin();
  const data = JSON.parse(input);
  const command = data.tool_input?.command || '';
  const prBody = parseGhPrCommand(command);

  if (prBody === null) {
    process.exit(0);
  }

  if (prBody.includes(FORBIDDEN_TEXT)) {
    console.error(`ERROR: PR description contains forbidden text.

Remove this line from the PR body:
  "${FORBIDDEN_TEXT}"

This text should not appear in PR descriptions.`);
    process.exit(2);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(`Hook error: ${err.message}`);
  process.exit(2);
});
