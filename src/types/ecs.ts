/**
 * ECS Type Definitions
 *
 * Core types for the Entity Component System using miniplex.
 * Components are optional properties on Entity - miniplex uses presence/absence
 * of properties to determine which entities belong to which archetypes.
 */

import type { PositionComponent } from '../ecs/components/positionComponent';
import type { ItemComponent } from '../ecs/components/itemComponent';
import type { GridComponent } from '../ecs/components/gridComponent';
import type { ContainerComponent } from '../ecs/components/containerComponent';
import type { TemplateComponent } from '../ecs/components/templateComponent';
import type { EquipmentComponent } from '../ecs/components/equipmentComponent';
import type { ConditionsComponent } from '../ecs/components/conditionsComponent';
import type { HexPositionComponent } from '../ecs/components/hexPositionComponent';
import type { HexTileComponent } from '../ecs/components/hexTileComponent';
import type { UnitComponent } from '../ecs/components/unitComponent';

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
