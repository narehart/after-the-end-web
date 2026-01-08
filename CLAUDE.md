# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UI prototyping environment for **After the End**, a turn-based hex-grid survival game. This React/TypeScript project experiments with inventory management, equipment systems, and gamepad navigation before implementing in Godot.

**Stack:** React 19, Vite 7, TypeScript (strictest settings), ECS (miniplex), Zustand, CSS Modules

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint (JS/TS)
npm run lint:css     # Stylelint (CSS)
npm run lint:ls      # ls-lint (file naming)
npm run format       # Prettier formatting
```

## Dev Server Control

Use the `dev-server` MCP instead of `npm run dev`:

| Tool                          | Usage              |
| ----------------------------- | ------------------ |
| `mcp__dev-server__dev_start`  | Start dev server   |
| `mcp__dev-server__dev_stop`   | Stop the server    |
| `mcp__dev-server__dev_status` | Check if running   |
| `mcp__dev-server__dev_logs`   | View recent output |

**Do not use:** `npm run dev` directly - use the MCP for proper process tracking.

## Browser Automation

**Use Tauri MCP, not Chrome DevTools MCP.** This is a Tauri desktop app, not a browser app.

| Tool                                     | Usage                        |
| ---------------------------------------- | ---------------------------- |
| `mcp__tauri__tauri_driver_session`       | Connect to running Tauri app |
| `mcp__tauri__tauri_webview_screenshot`   | Take screenshot              |
| `mcp__tauri__tauri_webview_execute_js`   | Run JavaScript in webview    |
| `mcp__tauri__tauri_read_logs`            | Read console/system logs     |
| `mcp__tauri__tauri_webview_find_element` | Find DOM elements            |

**Do not use:** `mcp__chrome-devtools__*` tools - they are for browser automation, not Tauri apps.

## Architecture

### Hybrid ECS + Zustand

**ECS (miniplex)** is the source of truth for game data. **Zustand** handles UI-only state.

#### ECS Layer (`src/ecs/`)

```
ecs/
├── world.ts           # World singleton, Entity type
├── components/        # Component type definitions (data-only interfaces)
├── systems/           # Game logic (must reference world or queries)
│   ├── moveItemSystem.ts
│   ├── destroyItemSystem.ts
│   ├── splitItemSystem.ts
│   └── ...
├── entities/          # Entity factory functions (must call world.add)
│   ├── itemEntity.ts
│   └── gridEntity.ts
└── queries/           # Query helpers (must reference world)
    └── inventoryQueries.ts
```

**ECS owns:** Items, grids, equipment slots, character conditions

**ECS Directory Restrictions (enforced by ESLint):**

| Directory       | Restriction                                     | Rule                               |
| --------------- | ----------------------------------------------- | ---------------------------------- |
| `ecs/queries/`  | All functions must reference `world`            | `ecs-queries-use-world`            |
| `ecs/entities/` | All functions must call `world.add()`           | `ecs-entities-add-to-world`        |
| `ecs/systems/`  | All functions must reference `world` or queries | `ecs-systems-use-world-or-queries` |

**Why these restrictions?** Prevents dumping pure utility functions into ECS directories. If a function doesn't interact with the ECS world, it belongs in `src/utils/`.

**Pattern:** Systems are pure functions that query/mutate the world and return success/failure:

```typescript
const result = moveItem({ entityId, targetGridId });
if (!result.success) return false;
```

#### Zustand Layer (`src/stores/slices/`)

```
inventoryStore.ts        # Combines all slices
├── uiSlice.ts           # Selection, menus, scale
├── navigationSlice.ts   # Focus paths (reads initial state from ECS)
├── equipmentSlice.ts    # Equipment mirror (synced from ECS)
├── equipmentActionsSlice.ts # Actions that call ECS systems
├── conditionsSlice.ts   # Character conditions
└── inputModeSlice.ts    # Keyboard vs pointer mode
```

**Zustand owns:** UI state only (selection, menus, focus paths, input mode)

**Pattern:** Action slices call ECS systems, then sync Zustand state:

```typescript
destroyItem: (itemId): boolean => {
  const result = ecsDestroyItem({ entityId: itemId });
  if (!result.success) return false;
  set({ equipment: getEquipment().equipment, selectedItemId: null });
  return true;
};
```

#### React Bridge (`src/hooks/`)

- `useECSInventory.ts` - Subscribe to ECS entities via miniplex-react
- `useMenuContext.ts` - Combine ECS queries with Zustand state for menus

### File Organization Rules

**Enforced by custom ESLint rules and ls-lint:**

| Directory             | Naming          | Contents                           |
| --------------------- | --------------- | ---------------------------------- |
| `src/ui/`             | PascalCase      | `.tsx` + paired `.module.css`      |
| `src/ecs/systems/`    | `*System.ts`    | ECS system functions               |
| `src/ecs/components/` | `*Component.ts` | ECS component type definitions     |
| `src/ecs/entities/`   | `*Entity.ts`    | Entity factory functions           |
| `src/ecs/queries/`    | `*Queries.ts`   | Reusable query helpers             |
| `src/hooks/`          | `use*.ts`       | One custom hook per file           |
| `src/utils/`          | camelCase       | One function per file              |
| `src/constants/`      | camelCase       | Data constants only (no functions) |
| `src/types/`          | camelCase       | Type definitions only              |
| `src/stores/slices/`  | `*Slice.ts`     | Zustand slice creators             |
| `eslint-rules/`       | kebab-case      | Custom ESLint rules                |

### Component Philosophy

When creating or modifying components:

1. **Check for existing components first** - Before creating new UI elements, look for existing components with similar functionality (Button, Panel, Text, Flex, etc.)
2. **Keep components simple and composable** - Components should do one thing well and compose together
3. **Refactor shared patterns** - When you notice similar code across components, extract it into a reusable component
4. **Use primitive components** - Build features by composing simple building blocks (Box, Flex, Text, Button, Panel, Icon, etc.)
5. **Delegate logic to hooks/utils** - Components should focus on rendering; complex logic belongs in custom hooks or utility functions

### CSS Architecture

**CSS Modules with design tokens:**

- All styling via CSS variables defined in `src/index.css`
- Stylelint enforces variables for colors, spacing, typography, shadows
- BEM naming: `.block-element--modifier`
- Use `classnames/bind` for conditional classes:

```tsx
import classNames from 'classnames/bind';
import styles from './Component.module.css';
const cx = classNames.bind(styles);

<div className={cx('cell', { 'cell--selected': isSelected })} />;
```

**Custom property prefixes:** `font-`, `space-`, `z-`, `shadow-`, `size-`, `bg-`, `text-`, `border-`, `accent-`

### Complexity Limits

| Metric                  | Limit |
| ----------------------- | ----- |
| File lines              | 250   |
| Function lines          | 100   |
| Statements per function | 20    |
| Cyclomatic complexity   | 10    |

## Custom ESLint Rules

Located in `eslint-rules/`, these enforce architectural constraints.

**Testing:** You can't test ESLint rules with files in the system `/tmp` directory. ESLint will ignore these. Create test files within the project directory instead.

### ECS Rules

- `ecs-queries-use-world` - Query functions must reference the ECS world
- `ecs-entities-add-to-world` - Entity factory functions must call `world.add()`
- `ecs-systems-use-world-or-queries` - System functions must reference `world` or imported query functions
- `no-react-in-ecs` - No React imports in ECS directory
- `no-ecs-in-ui` - No direct ECS imports in UI components
- `one-system-per-file` - Single system function per file
- `ecs-components-data-only` - Components must be data-only interfaces

### File Organization Rules

- `no-cross-component-css-imports` - CSS files only import from same component
- `no-plain-classname-literals` - Must use classnames binding
- `one-function-per-utils-file` - Single export per utility file
- `one-hook-per-file` - Single custom hook per file
- `types-in-types-directory` - Type definitions only in `src/types/`
- `data-constants-in-constants-dir` - Constants only in `src/constants/`
- `no-functions-in-constants` - No function definitions in constants
- `no-screaming-snake-constants` - camelCase for non-exported constants
- `function-interface-naming` - `UseX` for hooks, `Props`/`Return` suffix for interfaces
- `no-reexports-in-types` - No re-exports in type files
- `no-component-helper-functions` - Components should delegate to hooks/utils
- `no-hooks-in-utils` - No React hooks in utility files

## TypeScript Configuration

**Strictest possible settings** - all strict flags enabled plus:

- `exactOptionalPropertyTypes`
- `noUncheckedIndexedAccess`
- `noPropertyAccessFromIndexSignature`
- `verbatimModuleSyntax`

ESLint enforces:

- Explicit return types on functions
- No `any` types
- Consistent type imports (`import type`)
- No type assertions (`as` forbidden)
- Exhaustive switch statements

## Data Flow

```
User Input (Gamepad/Keyboard)
    ↓
React Hooks (useMenuContext, useECSInventory)
    ↓
Zustand Actions → ECS Systems (moveItem, destroyItem)
    ↓
ECS World (entity mutations)
    ↓
miniplex-react useEntities() triggers re-render
    ↓
Zustand UI state sync (selection cleared, equipment updated)
    ↓
CSS Modules + CSS Variables → Visual Update
```

**Initialization order:** ECS initializes at module load (`src/index.tsx` imports `initializeInventorySystem` first), ensuring the world is populated before Zustand reads initial state.

## Verifying UI Changes

Use the Tauri MCP to verify UI fixes:

```javascript
// Query computed styles via tauri_webview_execute_js
(() => {
  const el = document.querySelector('.my-element');
  const styles = window.getComputedStyle(el);
  return {
    color: styles.color,
    padding: styles.padding,
    display: styles.display,
  };
})();
```

For visual verification, use `mcp__tauri__tauri_webview_screenshot`.

## Git Workflow

### Branch Protection

- No direct pushes to `main` - all changes require PRs
- PRs can be self-merged (0 approvals required)
- Required status checks: Conventional Commits, Lint, Format, Typecheck, Build

### Issue-First Development

Create a GitHub issue before starting work:

```bash
gh issue create --title "Add feature X" --body "## Description
What needs to be done.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2"
```

Issues must have: title, description, and acceptance criteria section.

### Branch Naming

Format: `<type>/<scope>/<issue-number>/<description>`

```bash
git checkout -b feat/ui/123/add-dark-mode
git checkout -b fix/inventory/456/item-duplication
git checkout -b ci/workflow/789/add-linting
```

**Valid types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore

The `preBranchCreate.cjs` hook enforces this format and validates the linked issue exists.

### Commits

Use single-line conventional commit messages:

```bash
git commit -m "feat(ui): add dark mode toggle"
git commit -m "fix(inventory): prevent item duplication"
```

### Releases

Uses [release-please](https://github.com/googleapis/release-please) for automated releases:

1. Conventional commits on `main` trigger release-please
2. A "Release PR" is auto-created/updated with changelog and version bump
3. Merging the Release PR creates a GitHub release with Tauri builds

Version bumps based on commits:

- `fix:` → patch (1.0.0 → 1.0.1)
- `feat:` → minor (1.0.0 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` → major (1.0.0 → 2.0.0)

## Gamepad Support

Full gamepad navigation via:

- `useGamepad.ts` - Core gamepad polling and event handling
- `useGamepadNavigation.ts` - Directional navigation with repeat delay
- `useMenuKeyboard.ts` - Keyboard fallback for menu navigation

Constants in `src/constants/gamepad.ts` define button mappings and timing.

## Claiming Work Complete

When claiming work is complete, use this format:

```
**Task:** <name of what you did>
**Type:** <ui fix | code change | bug fix | new feature | config change>
**Satisfaction criteria:** <what must be true for this task to be complete>
**Evidence:** <verification that directly proves the satisfaction criteria are met>
**Commit:** <commit hash>
```

**Evidence requirements:**

- Evidence must DIRECTLY VERIFY the satisfaction criteria, not just that code compiles
- Build/lint/typecheck passing is NOT evidence - it only proves code is valid, not that it works
- Work must be committed before claiming completion

| Change Type    | Required Evidence                         |
| -------------- | ----------------------------------------- |
| UI features    | Screenshot + description of what you see  |
| API/backend    | Actual request/response output            |
| Config changes | Command output demonstrating the behavior |
| Bug fixes      | Before/after showing the fix works        |

**Bad evidence** (proves nothing about functionality):

- "typecheck/lint/build passed"
- "committed the changes"
- "the code should now..."

**Good evidence** (directly verifies the feature works):

- Screenshot showing the UI change
- Command output demonstrating the behavior
- Test run output showing pass/fail
- Actual error message or success message from running the feature

**Example:**

```
**Task:** Add git commit-msg hook for conventional commits
**Type:** config change
**Satisfaction criteria:** Hook rejects non-conventional commits, accepts valid ones
**Evidence:**
- `git commit -m "bad"` → "ERROR: Must follow conventional commit format"
- `git commit -m "feat: add feature"` → "[main abc123] feat: add feature"
**Commit:** abc1234
```
