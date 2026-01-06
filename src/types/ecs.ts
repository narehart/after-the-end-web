/**
 * ECS Type Definitions
 *
 * Core types for the Entity Component System using miniplex.
 * Components are optional properties on Entity - miniplex uses presence/absence
 * of properties to determine which entities belong to which archetypes.
 */

/**
 * Position within a grid (inventory, equipment slot, etc.)
 */
export interface PositionComponent {
  gridId: string;
  x: number;
  y: number;
}

/**
 * Item data (template reference, quantity, durability)
 */
export interface ItemComponent {
  templateId: string;
  quantity: number;
  durability: number;
  maxDurability: number;
}

/**
 * Grid structure (inventory grid, container grid)
 */
export interface GridComponent {
  width: number;
  height: number;
  cells: Array<string | null>; // Entity IDs or null for empty cells
}

/**
 * Container reference (links to a grid entity)
 */
export interface ContainerComponent {
  gridEntityId: string;
}

/**
 * Equipment slots
 */
export interface EquipmentComponent {
  slots: Record<string, string | null>; // slot type -> entity ID or null
}

/**
 * Character conditions (health, hunger, thirst, etc.)
 */
export interface ConditionsComponent {
  health: number;
  maxHealth: number;
  hunger: number;
  maxHunger: number;
  thirst: number;
  maxThirst: number;
  temperature: number;
  encumbrance: number;
  maxEncumbrance: number;
}

/**
 * Hex grid position (axial coordinates)
 */
export interface HexPositionComponent {
  q: number;
  r: number;
}

/**
 * Hex tile data
 */
export interface HexTileComponent {
  terrain: string;
  passable: boolean;
  visibility: 'hidden' | 'explored' | 'visible';
}

/**
 * Unit data (for characters, enemies, NPCs)
 */
export interface UnitComponent {
  unitType: string;
  faction: string;
  actionPoints: number;
  maxActionPoints: number;
}

/**
 * Entity - the base type for all game entities
 *
 * In miniplex, entities are plain objects. Components are optional properties.
 * An entity "has" a component if the property exists and is not undefined.
 */
export interface Entity {
  // Core identity
  id?: string;

  // Inventory/Item components
  position?: PositionComponent;
  item?: ItemComponent;
  grid?: GridComponent;
  container?: ContainerComponent;

  // Character components
  equipment?: EquipmentComponent;
  conditions?: ConditionsComponent;

  // World/Map components (Phase 4)
  hexPosition?: HexPositionComponent;
  hexTile?: HexTileComponent;
  unit?: UnitComponent;
}
