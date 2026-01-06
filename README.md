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
│   ├── world.ts           # World singleton
│   ├── components/        # Component type definitions
│   ├── systems/           # Game logic (pure functions)
│   ├── entities/          # Entity factories
│   └── queries/           # Reusable queries
├── stores/                # Zustand (UI state only)
│   └── slices/            # UI slices
├── ui/                    # React components
├── hooks/                 # React hooks (bridge ECS ↔ React)
├── types/                 # TypeScript definitions
├── constants/             # Game constants
└── utils/                 # Utility functions
```

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
