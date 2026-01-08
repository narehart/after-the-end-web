#!/usr/bin/env node

/**
 * Pre-branch creation hook
 * Validates that:
 * 1. A GitHub issue exists with title, description, and acceptance criteria
 * 2. Branch name follows: <type>/<scope>/<issue-number>/<description>
 *    e.g., feat/ui/123/add-dark-mode
 */

const { execSync } = require('child_process');

const VALID_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
];

const BRANCH_PATTERN = /^([a-z]+)\/([a-z-]+)\/(\d+)\/([a-z0-9-]+)$/;

function parseBranchCommand(command) {
  const match = command.match(/git\s+(?:checkout\s+-b|branch|switch\s+-c)\s+["']?([^\s"']+)["']?/);
  return match ? match[1] : null;
}

function validateBranchFormat(branchName) {
  const match = branchName.match(BRANCH_PATTERN);
  if (!match) {
    return { valid: false, error: formatBranchError(branchName) };
  }

  const [, type, , issueNumber] = match;
  if (!VALID_TYPES.includes(type)) {
    return {
      valid: false,
      error: `ERROR: Invalid commit type "${type}".\n\nValid types: ${VALID_TYPES.join(', ')}`,
    };
  }

  return { valid: true, type, issueNumber };
}

function formatBranchError(branchName) {
  return `ERROR: Invalid branch name format.

Expected: <type>/<scope>/<issue-number>/<description>
Example:  feat/ui/123/add-dark-mode
Got:      ${branchName}

Valid types: ${VALID_TYPES.join(', ')}
Scope: lowercase with hyphens (e.g., ui, auth, inventory)
Description: lowercase alphanumeric with hyphens`;
}

function fetchGitHubIssue(issueNumber) {
  try {
    const json = execSync(`gh issue view ${issueNumber} --json title,body,state`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { success: true, issue: JSON.parse(json) };
  } catch {
    return {
      success: false,
      error: `ERROR: GitHub issue #${issueNumber} not found.\n\nCreate an issue first with:\n  gh issue create --title "Your title" --body "Description and acceptance criteria"`,
    };
  }
}

function validateIssue(issue, issueNumber) {
  if (!issue.title || issue.title.trim() === '') {
    return `ERROR: Issue #${issueNumber} has no title.`;
  }

  if (!issue.body || issue.body.trim() === '') {
    return `ERROR: Issue #${issueNumber} has no description.\n\nEdit the issue to add a description:\n  gh issue edit ${issueNumber} --body "Your description"`;
  }

  const hasAcceptanceCriteria = /acceptance\s*criteria|## ac\b|## criteria|\[[ x]\]/i.test(
    issue.body
  );
  if (!hasAcceptanceCriteria) {
    return `ERROR: Issue #${issueNumber} has no acceptance criteria.\n\nThe issue body must include acceptance criteria. Add one of:\n- A section titled "Acceptance Criteria" or "## AC"\n- A checklist with [ ] or [x] items\n\nEdit the issue:\n  gh issue edit ${issueNumber}`;
  }

  if (issue.state !== 'OPEN') {
    return `ERROR: Issue #${issueNumber} is ${issue.state.toLowerCase()}.\n\nOnly open issues can be worked on.`;
  }

  return null;
}

function validateBranchCreation(branchName) {
  const branchResult = validateBranchFormat(branchName);
  if (!branchResult.valid) {
    return { success: false, error: branchResult.error };
  }

  const issueResult = fetchGitHubIssue(branchResult.issueNumber);
  if (!issueResult.success) {
    return { success: false, error: issueResult.error };
  }

  const issueError = validateIssue(issueResult.issue, branchResult.issueNumber);
  if (issueError) {
    return { success: false, error: issueError };
  }

  return {
    success: true,
    message: `✓ Branch "${branchName}" linked to issue #${branchResult.issueNumber}: ${issueResult.issue.title}`,
  };
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
  const branchName = parseBranchCommand(command);

  if (!branchName) {
    process.exit(0);
  }

  const result = validateBranchCreation(branchName);
  if (!result.success) {
    console.error(result.error);
    process.exit(2);
  }

  console.log(result.message);
  process.exit(0);
}

main().catch((err) => {
  console.error(`Hook error: ${err.message}`);
  process.exit(2);
});
