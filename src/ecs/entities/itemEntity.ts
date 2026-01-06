/**
 * Item Entity Factory
 *
 * Creates item entities with the necessary components.
 * Items have: id, item component, template component, and optionally position/container.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import type { Item } from '../../types/inventory';
import { DEFAULT_QUANTITY } from '../../constants/inventory';
import { generateInstanceId } from '../../utils/generateInstanceId';

interface CreateItemEntityProps {
  template: Item;
  quantity?: number;
  durability?: number | null;
  gridId?: GridId;
  x?: number;
  y?: number;
  id?: EntityId;
}

interface CreateItemEntityReturn {
  entity: Entity;
  entityId: EntityId;
}

export function createItemEntity(props: CreateItemEntityProps): CreateItemEntityReturn {
  const { template, quantity, durability, gridId, x, y, id } = props;

  const entityId = id ?? generateInstanceId(template.neoId);

  const entity: Entity = {
    id: entityId,
    item: {
      templateId: template.id,
      quantity: quantity ?? DEFAULT_QUANTITY,
      durability: durability ?? null,
      maxDurability: template.durability ?? null,
    },
    template: {
      template,
    },
  };

  // Add position if grid coordinates provided
  if (gridId !== undefined && x !== undefined && y !== undefined) {
    entity.position = { gridId, x, y };
  }

  // Add container component if item has grid size (is a container)
  if (template.gridSize !== undefined) {
    entity.container = {
      gridEntityId: `${entityId}-grid`,
    };
  }

  world.add(entity);

  return { entity, entityId };
}
