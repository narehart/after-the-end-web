Create a GitHub issue and branch for the following task:

$ARGUMENTS

## Instructions

1. **Analyze the task** to determine:
   - **Type:** feat, fix, docs, style, refactor, perf, test, build, ci, chore
   - **Scope:** The area of the codebase (e.g., ui, eslint, ecs, hooks, stores, utils)
   - **Title:** A concise title for the issue
   - **Description:** Expand on the task with context and motivation
   - **Acceptance Criteria:** Specific, testable conditions that must be met for the issue to be considered complete

2. **If the type, scope, or acceptance criteria are unclear**, ask the user to clarify using AskUserQuestion before proceeding.

3. **Create the GitHub issue** using:

   ```bash
   gh issue create --title "<type>: <title>" --body "$(cat <<'EOF'
   ## Summary
   <description>

   ## Acceptance Criteria
   - [ ] <criterion 1>
   - [ ] <criterion 2>
   - [ ] ...
   EOF
   )"
   ```

4. **Create and checkout the branch** following the naming convention:

   ```
   <type>/<scope>/<issue-number>/<kebab-case-description>
   ```

   Example: `feat/ui/42/add-dark-mode-toggle`

5. **Report the results:**
   - Issue URL
   - Branch name
   - Confirmation that you're ready to start work

## Branch Naming Rules

- **type:** feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **scope:** lowercase with hyphens (ui, eslint, ecs, hooks, stores, utils, cli, etc.)
- **issue-number:** The number from the created issue
- **description:** lowercase alphanumeric with hyphens, max 4 words

## Example

Input: "add a button to reset inventory"

Output:

- Issue #42: `feat: add inventory reset button`
  - Summary: Add a button that allows users to reset their inventory to the default state.
  - Acceptance Criteria:
    - [ ] Reset button appears in the inventory panel header
    - [ ] Clicking the button clears all items from inventory
    - [ ] Confirmation dialog prevents accidental resets
- Branch: `feat/ui/42/inventory-reset-button`
