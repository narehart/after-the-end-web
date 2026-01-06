# After the End - UI Prototype

UI prototyping environment for **After the End**, a turn-based hex-grid survival game. This React/TypeScript project experiments with inventory management, equipment systems, and gamepad navigation before implementing in Godot.

## Stack

- React 19, Vite 7, TypeScript (strictest settings)
- ECS (miniplex) for game state
- Zustand for UI state
- CSS Modules with design tokens

## Architecture

**Hybrid ECS + Zustand:**

- **ECS (miniplex)** - Source of truth for game data: items, grids, equipment, conditions
- **Zustand** - UI-only state: selection, menus, focus paths, input mode

```
src/
├── ecs/                   # Entity Component System
│   ├── world.ts           # World singleton, Entity type
│   ├── components/        # Component definitions (data-only)
│   ├── systems/           # Game logic (must reference world/queries)
│   ├── entities/          # Entity factories (must call world.add)
│   └── queries/           # Query helpers (must reference world)
├── stores/                # Zustand (UI state only)
│   └── slices/            # UI slices
├── ui/                    # React components (PascalCase)
├── hooks/                 # React hooks (bridge ECS ↔ React)
├── types/                 # TypeScript definitions only
├── constants/             # Data constants only (no functions)
├── utils/                 # Utility functions (one per file)
└── eslint-rules/          # Custom ESLint rules
```

### ECS Restrictions

All ECS directories have ESLint-enforced restrictions to prevent mixing concerns:

- **queries/** - Must reference `world` (no pure helpers)
- **entities/** - Must call `world.add()` (no builders without side effects)
- **systems/** - Must reference `world` or imported queries (no pure utils)

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

## Data Flow

```
User Input (Gamepad/Keyboard)
    ↓
React Hooks (useMenuContext, useECSInventory)
    ↓
ECS Systems (moveItem, destroyItem, etc.)
    ↓
ECS World (entity mutations)
    ↓
React re-renders via miniplex-react useEntities()
    ↓
Zustand UI state updates (selection cleared, etc.)
    ↓
CSS Modules → Visual Update
```
