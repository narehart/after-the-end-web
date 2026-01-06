---
name: custom-eslint-rules
description: Create custom ESLint rules to enforce architectural constraints
---

# Custom ESLint Rules

Write custom ESLint rules in `eslint-rules/` that enforce project-specific constraints.

## Requirements

- **File naming:** kebab-case `.ts` files (e.g., `no-functions-in-constants.ts`)
- **Default export:** `Rule.RuleModule` object
- **Registration:** Import and add to `localPlugin` in `eslint.config.ts`

## Pattern

```typescript
/**
 * ESLint rule: rule-name
 *
 * Brief description of what this rule enforces.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem', // or 'suggestion', 'layout'
    docs: {
      description: 'Human-readable description of the rule',
    },
    messages: {
      messageId: 'Error message with {{placeholder}} support.',
    },
    schema: [], // JSON Schema for rule options
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Optional: Only check specific directories
    if (!filename.includes(path.join('src', 'target-dir'))) {
      return {};
    }

    return {
      // AST node visitors
      FunctionDeclaration(node): void {
        context.report({
          node,
          messageId: 'messageId',
          data: { placeholder: node.id?.name ?? 'unknown' },
        });
      },
    };
  },
};

export default rule;
```

## Registration

1. Import the rule in `eslint.config.ts`:

```typescript
import myNewRule from './eslint-rules/my-new-rule.ts';
```

2. Add to `localPlugin.rules`:

```typescript
const localPlugin = {
  rules: {
    // ... existing rules
    'my-new-rule': myNewRule,
  },
};
```

3. Enable in `sharedRules` or specific file config:

```typescript
const sharedRules: Linter.RulesRecord = {
  // ... existing rules
  'local/my-new-rule': 'error',
};
```

## Common AST Node Types

| Node Type                 | When to Use                    |
| ------------------------- | ------------------------------ |
| `FunctionDeclaration`     | Named function declarations    |
| `ArrowFunctionExpression` | Arrow functions                |
| `FunctionExpression`      | Anonymous function expressions |
| `ImportDeclaration`       | Import statements              |
| `ExportNamedDeclaration`  | Named exports                  |
| `VariableDeclaration`     | const/let/var declarations     |
| `TSInterfaceDeclaration`  | TypeScript interfaces          |
| `TSTypeAliasDeclaration`  | TypeScript type aliases        |
| `CallExpression`          | Function calls                 |
| `MemberExpression`        | Property access (obj.prop)     |
| `Identifier`              | Variable/function names        |

## Type-Safe AST Access

ESLint nodes are loosely typed. Use helper functions for safe access:

```typescript
function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object';
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  if (!(key in obj)) return null;
  const value = obj[key];
  return typeof value === 'string' ? value : null;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return isNonNullObject(value) ? value : null;
}
```

## Directory-Scoped Rules

Most project rules target specific directories:

```typescript
// Only check src/constants/
if (!filename.includes(path.join('src', 'constants'))) {
  return {};
}

// Only check src/ecs/systems/
if (!filename.includes(path.join('src', 'ecs', 'systems'))) {
  return {};
}
```

## Tracking Imports

To validate that files import from specific sources:

```typescript
create(context): Rule.RuleListener {
  const importedNames = new Set<string>();

  return {
    ImportDeclaration(node): void {
      const source = node.source.value;
      if (typeof source === 'string' && source.includes('/queries/')) {
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier' && spec.local.name) {
            importedNames.add(spec.local.name);
          }
        }
      }
    },

    FunctionDeclaration(node): void {
      // Check if function uses any imported names
    },
  };
}
```

## Testing Rules

Create a test file in the actual project directory (not /tmp - ESLint ignores /tmp):

```bash
# Create test file
echo "test content" > src/test-rule-file.ts

# Run ESLint on it
npx eslint src/test-rule-file.ts

# Clean up
rm src/test-rule-file.ts
```

## Examples

Existing rules to reference:

- `no-functions-in-constants` - Simple directory restriction
- `ecs-systems-use-world-or-queries` - Complex import tracking + AST traversal
- `one-function-per-utils-file` - Counting exports
- `function-interface-naming` - TypeScript node inspection
