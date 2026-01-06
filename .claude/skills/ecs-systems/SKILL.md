---
name: ecs-systems
description: Create ECS system functions that mutate the game world
---

# ECS Systems

Write system functions in `src/ecs/systems/` that implement game logic.

## Requirements

- **File naming:** `*System.ts` (e.g., `moveItemSystem.ts`)
- **Must reference:** `world` or imported query functions from `src/ecs/queries/`
- **One system per file**

## Pattern

```typescript
import { world } from '../world';
import type { Entity } from '../world';

interface SystemNameProps {
  entityId: string;
  // other parameters
}

interface SystemNameReturn {
  success: boolean;
  // optional data on success
}

export function systemName(props: SystemNameProps): SystemNameReturn {
  const { entityId } = props;

  // Query entities
  const entity = world.get(entityId);
  if (entity === undefined) {
    return { success: false };
  }

  // Perform mutations
  world.update(entity, {
    /* component changes */
  });

  return { success: true };
}
```

## Rules

1. **No pure helper functions** - Extract to `src/utils/` instead
2. **Props interface** - All parameters via single props object
3. **Return object** - Always return `{ success: boolean, ...data }`
4. **Query before mutate** - Validate entities exist before changing them
5. **Single responsibility** - One logical operation per system

## Examples

Good system names:

- `moveItemSystem` - moves an item between grids
- `destroyItemSystem` - removes an item from the world
- `equipItemSystem` - places item in equipment slot

Bad (should be utils):

- `findFreePosition` - pure calculation, no world access
- `isSpaceFree` - pure validation, no world access
