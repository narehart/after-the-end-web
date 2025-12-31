# Inventory UI System Specification

## Overview

A responsive inventory management interface for a survival/scavenging game. The system handles equipment slots, nested container grids, and item manipulation. Built as a Next.js React application.

## Core Concept

**Breadcrumb + Focus Navigation**: The UI shows one grid at a time with clear navigation context. This solves the nested container problem (backpack → pouch → pill bottle) and the equipment layering problem (coat over vest over shirt) without spatial overlap confusion.

---

## Layout Structure

### Desktop Layout (3 columns)

```
┌─────────────────────────────────────────────────────────────────┐
│  EQUIPMENT PANEL  │  GRID PANEL (Focus)  │  DETAILS PANEL      │
│  (Left Column)    │  (Center Column)     │  (Right Column)     │
│                   │                      │                     │
│  Character Model  │  Breadcrumb Nav      │  Item Preview       │
│  Condition Stats  │  Active Grid         │  Item Name          │
│  Equipment Slots  │                      │  Item Description   │
│  (scrollable)     │                      │  Item Stats         │
│                   │                      │                     │
│                   │  ─────────────────   │                     │
│                   │                      │                     │
│                   │  Ground/Area Grid    │                     │
│                   │  (collapsible)       │                     │
└─────────────────────────────────────────────────────────────────┘
```

### Tablet/Steam Deck Layout (2 columns)

- Equipment Panel collapses to icon strip along left edge
- Tapping equipment slot opens it in Grid Panel
- Details Panel becomes a slide-up drawer on item selection

### Mobile/Switch Handheld (1 column)

- Tab-based navigation: Equipment | Inventory | Ground
- Details shown as modal overlay on item selection
- Character model becomes collapsible header

---

## Equipment Panel

### Character Model Display

- 3D or 2D character render that updates in real-time as equipment changes
- Positioned at top of equipment panel
- Does NOT function as clickable paper doll—purely visual feedback

### Condition Stats

- Displayed below or beside character model
- Shows active conditions: hunger, thirst, temperature, health, encumbrance, etc.
- Compact stat bars or icons with values

### Equipment Slots List

A vertical scrollable list of equipment slots. Each slot is a row:

```
┌─────────────────────────────────────────┐
│ [Icon] Slot Name          [Item Name] → │
└─────────────────────────────────────────┘
```

**Slot Categories** (in order):

| Slot           | Notes                         |
| -------------- | ----------------------------- |
| Helmet         | Head protection               |
| Eyes           | Glasses, goggles              |
| Face           | Masks, respirators            |
| Neck           | Scarves, necklaces            |
| Backpack       | Primary storage container     |
| Coat           | Outer layer                   |
| Vest           | Middle layer                  |
| Shirt          | Base layer                    |
| Right Shoulder | Pauldron, strap               |
| Left Shoulder  | Pauldron, strap               |
| Right Glove    |                               |
| Left Glove     |                               |
| Right Ring     |                               |
| Left Ring      |                               |
| Right Holding  | Held item (weapon, tool, bag) |
| Left Holding   | Held item (weapon, tool, bag) |
| Pouch          | Belt-mounted small storage    |
| Pants          |                               |
| Right Shoe     |                               |
| Left Shoe      |                               |

**Slot Row Behavior:**

- Empty slot: Shows "Empty" in muted text, can be drop target
- Equipped item: Shows item name, arrow indicates it has a grid (if applicable)
- Clicking a slot with a container item → Opens that item's grid in the Grid Panel
- Clicking a slot with a non-container item → Selects it, shows in Details Panel
- Slots are drop targets for drag-and-drop equipping

**Visual Indicator for Containers:**

- Slots containing items with grids show a subtle expand arrow or bag icon
- Currently focused container slot is highlighted

---

## Grid Panel

### Breadcrumb Navigation

Shows the current navigation path:

```
Backpack → Side Pouch → [Current View]
```

- Each segment is clickable to navigate back
- Root level shows the equipment slot name
- Breadcrumb updates as user drills into nested containers

### Active Grid Display

The main grid area showing the currently focused container's inventory:

**Grid Mechanics:**

- Items occupy cells based on their dimensions (e.g., 2x3, 1x1)
- Grid cells are square and uniformly sized
- Items display as sprites/icons filling their cell space
- Items can be rotated 90° to fit differently
- Drag-and-drop within grid to rearrange
- Drag to equipment slots to equip
- Drag between grids (when ground grid is visible)

**Container Items in Grid:**

- Containers (bags, boxes, pouches) appear as items in the grid
- Double-click or dedicated button to "enter" the container
- Visual indicator (folder icon, highlight) shows it's expandable
- Entering updates breadcrumb and swaps grid view

**Item Selection:**

- Single click selects item, shows details in Details Panel
- Selected item has visible highlight/border
- Selection persists during drag operations

**Rotation:**

- Selected item can be rotated via:
  - Keyboard shortcut (R key)
  - Right-click context menu
  - Button in Details Panel
- Rotation snaps 90°
- Visual preview before confirming placement

**Stacking:**

- Stackable items show quantity badge (e.g., "x5")
- Dragging stackable onto same type attempts to merge
- Shift+drag to split stacks (opens quantity input)

### Ground/Area Grid

A secondary grid representing items in the current game area:

- Positioned below the active inventory grid
- Collapsible/expandable to save space
- Same grid mechanics as inventory grids
- Items can be dragged between ground and inventory
- Label shows current area name

---

## Details Panel

Shows information about the currently selected item:

### Item Preview

- Large item sprite/icon
- Rotatable 3D preview if applicable

### Item Information

- **Name**: Item display name
- **Description**: Flavor text and functional description
- **Stats**: Weight, size (WxH), condition/durability, damage, protection, etc.
- **Container Info** (if applicable): Grid dimensions, current capacity

### Action Buttons

- **Equip** (if equippable to a slot)
- **Use** (if consumable/usable)
- **Enter** (if container—opens grid)
- **Rotate** (if selected in grid)
- **Drop** (move to ground)
- **Split** (if stackable with quantity > 1)

---

## Interaction Patterns

### Drag and Drop

- Drag from grid cell to: another cell, equipment slot, ground grid, trash/drop zone
- Visual feedback: ghost image follows cursor, valid drop targets highlight
- Invalid drops: item returns to origin with animation

### Keyboard Support

- Arrow keys: Navigate grid cells
- Enter: Select/interact with highlighted cell
- R: Rotate selected item
- Escape: Deselect / close modals
- Tab: Cycle between panels

### Touch/Controller Support

- Tap to select, tap again to interact
- Long press for drag mode
- Virtual cursor for controller (Steam Deck, Switch)
- D-pad navigation between slots and grid cells
- Face buttons mapped to common actions

---

## Visual Design Direction

**Aesthetic**: Utilitarian survival—worn textures, muted earth tones, functional typography. Think military surplus meets scrappy improvisation.

**Grid Appearance:**

- Subtle grid lines, not heavy borders
- Cell backgrounds slightly differentiated from panel background
- Items should "pop" against grid

**Color Coding:**

- Item rarity or type indicated by subtle border color or corner tag
- Condition/durability shown as colored bar on item

**Typography:**

- Clear, readable at small sizes
- Monospace or utilitarian sans-serif for stats
- Slightly weathered or stencil style for headers

---

## State Management Considerations

The UI needs to track:

```typescript
interface InventoryState {
	// Equipment slots map to item IDs (or null)
	equipment: Record<SlotType, string | null>;

	// All items indexed by ID
	items: Record<string, Item>;

	// Grid contents: which items are in which container, at what position
	grids: Record<string, GridState>;

	// Current navigation path (for breadcrumb)
	focusPath: string[]; // Array of container item IDs

	// Currently selected item
	selectedItemId: string | null;

	// Ground/area inventory
	groundGrid: GridState;
}

interface Item {
	id: string;
	type: ItemType;
	name: string;
	description: string;
	size: { width: number; height: number };
	rotation: 0 | 90 | 180 | 270;
	stackable: boolean;
	quantity: number;
	stats: Record<string, number>;
	gridSize?: { width: number; height: number }; // If container
	equippableSlots?: SlotType[];
}

interface GridState {
	width: number;
	height: number;
	cells: (string | null)[][]; // Item IDs or null
}
```

---

## Responsive Breakpoints

| Breakpoint | Layout   | Notes                                    |
| ---------- | -------- | ---------------------------------------- |
| ≥1200px    | 3-column | Full desktop experience                  |
| 800-1199px | 2-column | Tablet/Steam Deck, equipment as sidebar  |
| <800px     | 1-column | Mobile/Switch handheld, tabbed interface |

---

## Implementation Notes

- Use CSS Grid for the main layout and inventory grids
- Implement drag-and-drop with a library like `dnd-kit` or `react-beautiful-dnd`
- Consider `zustand` or `jotai` for state management (simpler than Redux for this)
- Grid collision detection needed for item placement validation
- Debounce/throttle drag events for performance
- Preload item sprites for smooth drag previews

---

## Out of Scope (for initial implementation)

- Crafting interface
- Item comparison tooltips
- Search/filter functionality
- Sort options
- Auto-arrange button
- Multiplayer/trading UI
