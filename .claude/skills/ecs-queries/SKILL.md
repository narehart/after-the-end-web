---
name: ecs-queries
description: Create ECS query helpers that read from the world without mutations
---

# ECS Queries

Write query helper functions in `src/ecs/queries/` that provide reusable read-only access to the world.

## Requirements

- **File naming:** `*Queries.ts` (e.g., `inventoryQueries.ts`)
- **Must reference:** `world` for queries
- **Group related queries** in single file

## Pattern

```typescript
import { world } from '../world';
import type { Entity } from '../world';

// Simple query - returns entities
export function getEntitiesWithComponent(): Entity[] {
  return world.with('componentName').entities;
}

// Filtered query - returns subset
export function getEntitiesByType(type: string): Entity[] {
  return world.with('componentName').entities.filter((e) => e.componentName.type === type);
}

// Single entity query - returns entity or undefined
export function getEntityById(id: string): Entity | undefined {
  return world.get(id);
}

// Derived data query - returns computed value
interface GetDerivedDataReturn {
  count: number;
  items: Entity[];
}

export function getDerivedData(): GetDerivedDataReturn {
  const items = world.with('item').entities;
  return {
    count: items.length,
    items,
  };
}
```

## Rules

1. **Read-only** - Queries must not mutate the world
2. **Must use world** - All queries access `world` directly
3. **Return typed data** - Define return interfaces for complex returns
4. **Group by domain** - Related queries in same file (e.g., all inventory queries)
5. **No side effects** - Pure functions that only read and return

## When to Use Queries vs Utils

| Use Query (`src/ecs/queries/`)    | Use Util (`src/utils/`)         |
| --------------------------------- | ------------------------------- |
| Needs `world` access              | Pure calculation/transformation |
| Returns entities or entity data   | Works on any input data         |
| Domain-specific (inventory, etc.) | Generic utility (arrays, math)  |

## Examples

Good queries:

- `getEquippedItems()` - returns entities with equipment component
- `getGridEntities(gridId)` - returns items in a specific grid
- `findItemByName(name)` - searches world for matching item

Bad (should be utils):

- `sortByName(items)` - pure array sort, no world access
- `calculateWeight(item)` - pure calculation on passed data
