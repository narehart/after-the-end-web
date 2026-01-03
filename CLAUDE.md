# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UI prototyping environment for **After the End**, a turn-based hex-grid survival game. This React/TypeScript project experiments with inventory management, equipment systems, and gamepad navigation before implementing in Godot.

**Stack:** React 19, Vite 7, TypeScript (strictest settings), Zustand, CSS Modules

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

## Architecture

### State Management: Zustand Slices

The store is split into domain slices in `src/stores/slices/`:

```
inventoryStore.ts     # Combines all slices
├── itemsSlice.ts     # Item templates, instances, grids
├── equipmentSlice.ts # Equipment slot state
├── equipmentActionsSlice.ts # equip/unequip/move operations
├── navigationSlice.ts # Focus paths (inventory/world panels)
├── uiSlice.ts        # UI state (selection, scale, menus)
└── conditionsSlice.ts # Character conditions (health, hunger)
```

**Pattern:** Each slice exports a `StateCreator` with `*State` and `*Actions` interfaces. Components use selectors for fine-grained reactivity:

```tsx
const selectedId = useInventoryStore((s) => s.selectedItemId);
```

### File Organization Rules

**Enforced by custom ESLint rules and ls-lint:**

| Directory | Naming | Contents |
|-----------|--------|----------|
| `src/components/` | PascalCase | `.tsx` + paired `.module.css` |
| `src/hooks/` | `use*.ts` | One custom hook per file |
| `src/utils/` | camelCase | One function per file |
| `src/constants/` | camelCase | Data constants only (no functions) |
| `src/types/` | camelCase | Type definitions only |
| `src/stores/slices/` | `*Slice.ts` | Zustand slice creators |
| `eslint-rules/` | kebab-case | Custom ESLint rules |

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

<div className={cx('cell', { 'cell--selected': isSelected })} />
```

**Custom property prefixes:** `font-`, `space-`, `z-`, `shadow-`, `size-`, `bg-`, `text-`, `border-`, `accent-`

### Complexity Limits

| Metric | Limit |
|--------|-------|
| File lines | 250 |
| Function lines | 100 |
| Statements per function | 20 |
| Cyclomatic complexity | 10 |

## Custom ESLint Rules

Located in `eslint-rules/`, these enforce architectural constraints:

- `no-cross-component-css-imports` - CSS files only import from same component
- `no-plain-classname-literals` - Must use classnames binding
- `one-function-per-utils-file` - Single export per utility file
- `one-hook-per-file` - Single custom hook per file
- `types-in-types-directory` - Type definitions only in `src/types/`
- `data-constants-in-constants-dir` - Constants only in `src/constants/`
- `no-functions-in-constants` - No function definitions in constants
- `no-screaming-snake-constants` - camelCase for non-exported constants
- `function-interface-naming` - `UseX` for hooks, `Props` suffix for interfaces
- `no-reexports-in-types` - No re-exports in type files
- `no-component-helper-functions` - Components should delegate to hooks/utils

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
Custom Hooks (useGamepad, useMenuContext)
    ↓
Store Actions (equipItem, moveItem)
    ↓
Zustand Store (slice mutations)
    ↓
Component Selectors (fine-grained subscriptions)
    ↓
CSS Modules + CSS Variables → Visual Update
```

## Verifying UI Changes

Prefer using the Chrome DevTools MCP to verify UI fixes over taking screenshots. Use `mcp__chrome-devtools__evaluate_script` to query computed styles:

```javascript
// Example: verify an element's computed styles
(el) => {
  const styles = window.getComputedStyle(el);
  return {
    color: styles.color,
    padding: styles.padding,
    display: styles.display
  };
}
```

This provides precise, programmatic verification of CSS values rather than visual inspection.

## Gamepad Support

Full gamepad navigation via:
- `useGamepad.ts` - Core gamepad polling and event handling
- `useGamepadNavigation.ts` - Directional navigation with repeat delay
- `useMenuKeyboard.ts` - Keyboard fallback for menu navigation

Constants in `src/constants/gamepad.ts` define button mappings and timing.
