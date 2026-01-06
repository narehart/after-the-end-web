/* eslint-disable local/types-in-types-directory -- ECS core types belong with world */
/**
 * ECS World - The central entity management system
 *
 * This file creates and exports the miniplex World instance that manages
 * all game entities and their components.
 */

import { World } from 'miniplex';
import type { PositionComponent } from './components/positionComponent';
import type { ItemComponent } from './components/itemComponent';
import type { GridComponent } from './components/gridComponent';
import type { ContainerComponent } from './components/containerComponent';
import type { TemplateComponent } from './components/templateComponent';
import type { EquipmentComponent } from './components/equipmentComponent';
import type { ConditionsComponent } from './components/conditionsComponent';
import type { HexPositionComponent } from './components/hexPositionComponent';
import type { HexTileComponent } from './components/hexTileComponent';
import type { UnitComponent } from './components/unitComponent';

/** Entity ID type for type safety */
export type EntityId = string;

/** Grid ID type for clarity */
export type GridId = string;

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

export const world = new World<Entity>();
