---
name: ecs-entities
description: Create ECS entity factory functions that add entities to the world
---

# ECS Entities

Write entity factory functions in `src/ecs/entities/` that create and add entities to the world.

## Requirements

- **File naming:** `*Entity.ts` (e.g., `itemEntity.ts`)
- **Must call:** `world.add()` to add the entity
- **One entity type per file**

## Pattern

```typescript
import { world } from '../world';
import type { Entity } from '../world';

interface CreateEntityNameProps {
  // required properties
  id: string;
  // optional properties
  optionalProp?: string | undefined;
}

export function createEntityName(props: CreateEntityNameProps): Entity {
  const { id, optionalProp } = props;

  const entity = world.add({
    id,
    // Required components
    componentA: {
      /* ... */
    },
    componentB: {
      /* ... */
    },
    // Optional components
    ...(optionalProp !== undefined && {
      optionalComponent: { value: optionalProp },
    }),
  });

  return entity;
}
```

## Rules

1. **Must add to world** - Factory must call `world.add()`
2. **Props interface** - All parameters via single props object
3. **Return entity** - Return the created entity for chaining
4. **Spread optional components** - Use conditional spread for optional components
5. **No business logic** - Entity creation only, no validation or side effects

## Component Structure

Components are data-only interfaces defined in `src/ecs/components/`:

```typescript
// In src/ecs/components/ItemComponent.ts
export interface ItemComponent {
  name: string;
  width: number;
  height: number;
  stackable: boolean;
}
```

Add to `Entity` type in `src/ecs/world.ts`.
