# ECS + PixiJS Migration Plan

## Summary

Migrate from React/Zustand architecture to ECS (miniplex) + PixiJS for game logic/rendering, keeping React for UI overlays. Big-bang migration per feature with full ESLint + ls-lint enforcement.

## New Directory Structure

```
src/
├── ui/                    # React UI (renamed from components/)
│   ├── App.tsx
│   ├── GameCanvas.tsx     # PixiJS mount
│   ├── inventory/         # Inventory UI overlays
│   └── hud/               # HUD components
│
├── ecs/                   # Entity Component System
│   ├── world.ts           # World singleton
│   ├── components/        # Data-only component definitions
│   │   ├── positionComponent.ts
│   │   ├── itemComponent.ts
│   │   ├── gridComponent.ts
│   │   └── ...
│   ├── systems/           # Logic (pure functions)
│   │   ├── inventorySystem.ts
│   │   ├── equipmentSystem.ts
│   │   └── ...
│   ├── entities/          # Entity factories
│   │   ├── itemEntity.ts
│   │   └── ...
│   └── queries/           # Reusable queries
│       └── itemQueries.ts
│
├── renderer/              # PixiJS layer
│   ├── core/
│   │   ├── gameRenderer.ts
│   │   └── rendererBridge.ts
│   ├── layers/
│   │   ├── hexGridLayer.ts
│   │   └── itemLayer.ts
│   ├── sprites/
│   │   └── itemSprite.ts
│   └── shaders/
│       └── outline.frag
│
├── game/                  # Game coordination
│   ├── core/
│   │   ├── gameLoop.ts
│   │   └── turnManager.ts
│   ├── input/
│   │   └── gamepadInput.ts
│   └── actions/
│       ├── moveAction.ts
│       └── attackAction.ts
│
├── stores/                # Zustand (UI state only)
│   └── slices/
│       ├── uiSlice.ts
│       ├── navigationSlice.ts
│       └── inputModeSlice.ts
│
├── hooks/                 # React hooks
├── types/                 # Type definitions
├── constants/             # Game constants
└── utils/                 # Generic utilities (reduced)
```

---

## Phase 0: Foundation Setup

### Dependencies

```bash
npm install miniplex pixi.js @pixi/react
```

### Directory Changes

1. Create: `src/ecs/`, `src/renderer/`, `src/game/`
2. Rename: `src/components/` → `src/ui/`
3. Update all imports referencing old path

### Files to Create

- `src/ecs/world.ts` - Empty world export
- `src/renderer/core/gameRenderer.ts` - Placeholder
- `src/types/ecs.ts` - ECS type definitions

### Config Updates (detailed below)

---

## Phase 1: Inventory System Migration

### ECS Components to Create

```
src/ecs/components/
├── positionComponent.ts    # { gridId, x, y }
├── itemComponent.ts        # { templateId, quantity, durability }
├── gridComponent.ts        # { width, height, cells }
├── containerComponent.ts   # { gridEntityId }
```

### Systems to Create

```
src/ecs/systems/
└── inventorySystem.ts      # moveItem, splitItem, destroyItem, mergeStacks
```

### Utils to Delete After Migration

- `moveItemInGrid.ts` → `inventorySystem.moveItem()`
- `splitItemInGrid.ts` → `inventorySystem.splitItem()`
- `destroyItemInGrid.ts` → `inventorySystem.destroyItem()`
- `placeItemInCells.ts` → internal to system
- `removeItemFromCells.ts` → internal to system
- `findItemInGrids.ts` → `itemQueries.ts`
- `mergeAndRemoveItem.ts` → `inventorySystem.ts`

### Zustand Slices to Delete

- `itemsSlice.ts` - Replaced by ECS

---

## Phase 2: Equipment System Migration

### ECS Components

```
src/ecs/components/
├── equipmentComponent.ts   # { slots: Record<SlotType, entityId | null> }
└── conditionsComponent.ts  # { health, hunger, thirst, temperature, encumbrance }
```

### Systems

```
src/ecs/systems/
├── equipmentSystem.ts      # equip, unequip
└── conditionsSystem.ts     # updateCondition, tickConditions
```

### Slices to Delete

- `equipmentSlice.ts`
- `equipmentActionsSlice.ts`
- `conditionsSlice.ts`

---

## Phase 3: PixiJS Renderer

### Core Setup

```
src/renderer/core/
├── gameRenderer.ts         # PIXI.Application wrapper
├── rendererBridge.ts       # ECS → React sync
└── assetLoader.ts          # Sprite loading
```

### Layers

```
src/renderer/layers/
├── inventoryGridLayer.ts   # Item grid rendering
└── hexGridLayer.ts         # Hex tiles (Phase 4)
```

### React Integration

- `src/ui/GameCanvas.tsx` - Canvas mount component
- `src/hooks/useECSQuery.ts` - Subscribe React to ECS

---

## Phase 4: Hex Grid + Turn System

### New Components

```
src/ecs/components/
├── hexPositionComponent.ts # { q, r } axial coords
├── hexTileComponent.ts     # { terrain, passable, visibility }
└── unitComponent.ts        # { unitType, faction, actionPoints }
```

### Game Logic

```
src/game/
├── core/turnManager.ts     # Turn phases
└── actions/
    ├── moveAction.ts       # Pathfinding + movement
    └── attackAction.ts     # Combat resolution
```

---

## ls-lint Updates

Add to `.ls-lint.yml`:

```yaml
# Add to src: .dir regex
.dir: ... | regex:ecs | regex:game | regex:renderer | regex:ui

# Rename components to ui
src/ui:
  .tsx: PascalCase
  .module.css: PascalCase
  .ts: regex:index
  .*: regex:$
  .dir: regex:ui | regex:inventory | regex:hud

# ECS directories
src/ecs:
  .ts: regex:world
  .*: regex:$
  .dir: regex:ecs | regex:components | regex:systems | regex:entities | regex:queries

src/ecs/components:
  .ts: regex:[a-z][a-zA-Z0-9]*Component
  .*: regex:$
  .dir: regex:components

src/ecs/systems:
  .ts: regex:[a-z][a-zA-Z0-9]*System
  .*: regex:$
  .dir: regex:systems

src/ecs/entities:
  .ts: regex:[a-z][a-zA-Z0-9]*Entity
  .*: regex:$
  .dir: regex:entities

src/ecs/queries:
  .ts: regex:[a-z][a-zA-Z0-9]*Queries
  .*: regex:$
  .dir: regex:queries

# Renderer directories
src/renderer:
  .*: regex:$
  .dir: regex:renderer | regex:core | regex:layers | regex:sprites | regex:shaders

src/renderer/core:
  .ts: camelCase
  .*: regex:$
  .dir: regex:core

src/renderer/layers:
  .ts: regex:[a-z][a-zA-Z0-9]*Layer
  .*: regex:$
  .dir: regex:layers

src/renderer/sprites:
  .ts: regex:[a-z][a-zA-Z0-9]*Sprite
  .*: regex:$
  .dir: regex:sprites

src/renderer/shaders:
  .frag: camelCase
  .vert: camelCase
  .*: regex:$
  .dir: regex:shaders

# Game directories
src/game:
  .*: regex:$
  .dir: regex:game | regex:core | regex:input | regex:actions

src/game/core:
  .ts: camelCase
  .*: regex:$
  .dir: regex:core

src/game/input:
  .ts: regex:[a-z][a-zA-Z0-9]*Input
  .*: regex:$
  .dir: regex:input

src/game/actions:
  .ts: regex:[a-z][a-zA-Z0-9]*Action
  .*: regex:$
  .dir: regex:actions
```

---

## New ESLint Rules

### Create in `eslint-rules/`:

1. **`no-react-in-ecs.ts`**
   - Forbids React imports in `src/ecs/**`
   - Keeps ECS layer framework-agnostic

2. **`no-ecs-in-ui.ts`**
   - Forbids direct ECS imports in `src/ui/**`
   - Must use bridge layer (`renderer/rendererBridge` or hooks)

3. **`one-system-per-file.ts`**
   - Like `one-function-per-utils-file` but for `src/ecs/systems/`
   - One exported system function per file

4. **`ecs-components-data-only.ts`**
   - ECS components in `src/ecs/components/` must be interfaces only
   - No methods, no functions, just data shapes

### Update `eslint.config.ts`:

- Import new rules
- Add to `localPlugin.rules`
- Add to `sharedRules`

---

## Critical Files to Modify

| File                           | Changes                                  |
| ------------------------------ | ---------------------------------------- |
| `.ls-lint.yml`                 | Add ECS/renderer/game/ui directory rules |
| `eslint.config.ts`             | Add 4 new ESLint rules                   |
| `src/stores/inventoryStore.ts` | Remove game slices, keep UI slices       |
| `tsconfig.json`                | Add path aliases for new directories     |
| `package.json`                 | Add miniplex, pixi.js dependencies       |

---

## Migration Order

1. **Phase 0**: Setup directories, rename components→ui, add configs
2. **Phase 1**: Migrate inventory (items, grids) to ECS
3. **Phase 2**: Migrate equipment + conditions to ECS
4. **Phase 3**: Add PixiJS renderer for inventory
5. **Phase 4**: Add hex grid rendering + turn system
6. **Cleanup**: Delete unused utils, remove legacy slices

Each phase is a complete feature migration - old code deleted, new code working.
