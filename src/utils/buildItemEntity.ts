/**
 * Build Item Entity
 *
 * Creates an item entity object from item data.
 */

import type { Entity } from '../ecs/world';
import type { Item } from '../types/inventory';
import { DEFAULT_QUANTITY } from '../constants/inventory';

interface BuildItemEntityProps {
  itemId: string;
  item: Item;
  position: { gridId: string; x: number; y: number } | undefined;
}

type BuildItemEntityReturn = Entity;

export function buildItemEntity(props: BuildItemEntityProps): BuildItemEntityReturn {
  const { itemId, item, position } = props;
  const entity: Entity = {
    id: itemId,
    item: {
      templateId: item.id,
      quantity: item.quantity ?? DEFAULT_QUANTITY,
      durability: item.durability ?? null,
      maxDurability: null,
    },
    template: { template: item },
  };

  if (position !== undefined) {
    entity.position = position;
  }

  if (item.gridSize !== undefined) {
    entity.container = { gridEntityId: itemId };
  }

  return entity;
}
