/**
 * ECS Type Definitions
 *
 * Core types for the Entity Component System using miniplex.
 * Components are optional properties on Entity - miniplex uses presence/absence
 * of properties to determine which entities belong to which archetypes.
 */

import type { Item, SlotType } from './inventory';

/** Entity ID type for type safety */
export type EntityId = string;

/** Grid ID type for clarity */
export type GridId = string;

/**
 * Position within a grid (inventory, container, etc.)
 */
export interface PositionComponent {
  gridId: GridId;
  x: number;
  y: number;
}

/**
 * Item instance data (references a template, tracks instance-specific state)
 */
export interface ItemComponent {
  templateId: string;
  quantity: number;
  durability: number | null;
  maxDurability: number | null;
}

/**
 * Grid structure (inventory grid, container grid)
 * Uses 2D array matching existing CellGrid type
 */
export interface GridComponent {
  gridId: GridId;
  width: number;
  height: number;
  cells: Array<Array<EntityId | null>>;
}

/**
 * Container component - marks an item as having internal storage
 */
export interface ContainerComponent {
  gridEntityId: EntityId;
}

/**
 * Item template reference - cached template data for quick access
 */
export interface TemplateComponent {
  template: Item;
}

/**
 * Equipment slots
 */
export interface EquipmentComponent {
  slots: Record<SlotType, EntityId | null>;
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
  // Core identity (assigned by miniplex or manually)
  id?: EntityId;

  // Inventory/Item components
  position?: PositionComponent;
  item?: ItemComponent;
  template?: TemplateComponent;
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
