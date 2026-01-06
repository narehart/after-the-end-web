---
name: hooks
description: Create React hooks that bridge ECS and Zustand with React
---

# React Hooks

Write custom hooks in `src/hooks/` that bridge ECS/Zustand with React components.

## Requirements

- **File naming:** `use*.ts` (e.g., `useMenuContext.ts`)
- **One hook per file** - enforced by ESLint
- **Named export** matching filename

## Pattern

```typescript
import { useCallback, useMemo } from 'react';
import { useEntities } from 'miniplex-react';

import { world } from '../ecs/world';
import { useInventoryStore } from '../stores/inventoryStore';

interface UseHookNameProps {
  entityId: string;
}

interface UseHookNameReturn {
  data: SomeType;
  actions: {
    doSomething: () => void;
  };
}

export function useHookName(props: UseHookNameProps): UseHookNameReturn {
  const { entityId } = props;

  // ECS subscription
  const { entities } = useEntities(world.with('componentName'));

  // Zustand state
  const selectedId = useInventoryStore((state) => state.selectedItemId);

  // Derived data
  const data = useMemo(() => {
    return entities.find((e) => e.id === entityId);
  }, [entities, entityId]);

  // Actions
  const doSomething = useCallback(() => {
    // Call ECS system or Zustand action
  }, []);

  return {
    data,
    actions: { doSomething },
  };
}
```

## Rules

1. **One hook per file** - File name matches hook name
2. **Props interface** - Use props object for multiple parameters
3. **Return interface** - Define return type for complex returns
4. **Memoize appropriately** - Use `useMemo`/`useCallback` for derived data and callbacks
5. **Bridge only** - Hooks connect data sources to React, don't implement business logic

## Hook Categories

### ECS Bridge Hooks

Subscribe to ECS entities via miniplex-react:

```typescript
import { useEntities } from 'miniplex-react';
const { entities } = useEntities(world.with('item'));
```

### Zustand Bridge Hooks

Select state from Zustand stores:

```typescript
const value = useInventoryStore((state) => state.value);
const action = useInventoryStore((state) => state.action);
```

### Combined Hooks

Combine ECS queries with Zustand state for UI:

```typescript
export function useMenuContext(): MenuContext {
  const { entities } = useEntities(world.with('item'));
  const selectedId = useInventoryStore((state) => state.selectedItemId);
  // Combine and return
}
```

## Examples

Good hooks:

- `useECSInventory` - subscribes to inventory entities
- `useMenuContext` - combines ECS + Zustand for menu rendering
- `useGamepad` - handles gamepad input events
- `useScale` - manages UI scaling state

Bad (belong elsewhere):

- `useMoveItem` - should be ECS system, not hook
- `useCalculateWeight` - should be util, not hook
