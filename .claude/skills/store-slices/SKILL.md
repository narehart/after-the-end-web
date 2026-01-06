---
name: store-slices
description: Create Zustand store slices for UI-only state management
---

# Store Slices

Write Zustand slices in `src/stores/slices/` for UI-only state.

## Requirements

- **File naming:** `*Slice.ts` (e.g., `uiSlice.ts`)
- **UI state only** - game data belongs in ECS
- **Call ECS systems** for mutations, then sync UI state

## Pattern

```typescript
import type { StateCreator } from 'zustand';

import { someSystem } from '../../ecs/systems/someSystem';
import { getQuery } from '../../ecs/queries/someQueries';

// State interface
interface SliceNameState {
  selectedId: string | null;
  isOpen: boolean;
}

// Actions interface
interface SliceNameActions {
  select: (id: string) => void;
  toggle: () => void;
  performAction: (id: string) => boolean;
}

// Combined slice type
export interface SliceNameSlice extends SliceNameState, SliceNameActions {}

// Initial state
const initialState: SliceNameState = {
  selectedId: null,
  isOpen: false,
};

// Slice creator
export const createSliceNameSlice: StateCreator<SliceNameSlice, [], [], SliceNameSlice> = (
  set,
  get
) => ({
  ...initialState,

  select: (id): void => {
    set({ selectedId: id });
  },

  toggle: (): void => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  performAction: (id): boolean => {
    // Call ECS system
    const result = someSystem({ entityId: id });
    if (!result.success) return false;

    // Sync UI state from ECS
    const data = getQuery();
    set({ selectedId: null, ...data });
    return true;
  },
});
```

## Rules

1. **UI state only** - Never store game data (items, grids, conditions)
2. **ECS is source of truth** - Call ECS systems for mutations
3. **Sync after ECS calls** - Update UI state after successful ECS operations
4. **Return success/failure** - Actions that call ECS should return boolean
5. **Separate state and actions** - Define interfaces for both

## Slice Categories

### Pure UI State

State with no ECS interaction:

- `uiSlice` - selection, scale, menu visibility
- `inputModeSlice` - keyboard vs pointer mode

### ECS-Synced State

State that mirrors or derives from ECS:

- `equipmentSlice` - mirrors equipment from ECS
- `navigationSlice` - focus paths derived from ECS grids

### Action Slices

Actions that call ECS systems:

- `equipmentActionsSlice` - equip, unequip, destroy items

## Combining Slices

In main store file:

```typescript
import { create } from 'zustand';
import { createSliceASlice } from './slices/sliceASlice';
import { createSliceBSlice } from './slices/sliceBSlice';

type StoreState = SliceASlice & SliceBSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createSliceASlice(...args),
  ...createSliceBSlice(...args),
}));
```

## What Belongs in Zustand vs ECS

| Zustand (UI State) | ECS (Game State)             |
| ------------------ | ---------------------------- |
| Selected item ID   | Item entities and components |
| Menu open/closed   | Grid contents                |
| Focus path         | Equipment slots              |
| Input mode         | Character conditions         |
| UI scale           | Item positions               |
