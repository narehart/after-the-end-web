---
name: utils
description: Create utility functions with one function per file
---

# Utility Functions

Write utility functions in `src/utils/` that provide pure, reusable logic.

## Requirements

- **File naming:** camelCase matching function name (e.g., `findFreePosition.ts`)
- **One function per file** - enforced by ESLint
- **No world/store access** - pure functions only

## Pattern

```typescript
/**
 * Function Name
 *
 * Brief description of what the function does.
 */

import { SOME_CONSTANT } from '../constants/domain';
import type { SomeType } from '../types/domain';

interface FunctionNameProps {
  requiredParam: string;
  optionalParam?: number | undefined;
}

interface FunctionNameReturn {
  result: string;
  metadata: number;
}

export function functionName(props: FunctionNameProps): FunctionNameReturn {
  const { requiredParam, optionalParam } = props;

  // Implementation
  const result = requiredParam.toUpperCase();
  const metadata = optionalParam ?? 0;

  return { result, metadata };
}
```

## Rules

1. **One function per file** - File name matches function name
2. **Props interface** - All parameters via single props object (unless single primitive)
3. **Return interface** - Define return type for complex returns
4. **Pure functions** - No side effects, no world/store access
5. **JSDoc header** - Brief description at top of file

## Shared Types

Use shared props types from `src/types/` to reduce duplication:

```typescript
import type { GridDimensionsProps, ItemDimensionsProps } from '../types/inventory';

interface MyFunctionProps extends GridDimensionsProps, ItemDimensionsProps {
  additionalProp: string;
}
```

## Simple Functions

For simple single-parameter functions, skip the props object:

```typescript
// OK for simple cases
export function capitalizeString(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
```

## Examples

Good utils:

- `findFreePosition` - finds available grid position
- `isSpaceFree` - checks if grid cells are unoccupied
- `shuffleArray` - randomizes array order
- `randomInt` - generates random integer in range

Bad (belong elsewhere):

- `getEquippedItems` - needs world access (use query)
- `moveItem` - mutates world (use system)
- `GRID_SIZE` - constant value (use constants)
