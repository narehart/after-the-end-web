/**
 * To Item
 *
 * Converts JSON item data to Item type.
 */

import type { Item } from '../types/inventory';
import type neoItemsJson from '../data/neoItems.json';
import { toItemType } from './toItemType';

type ToItemReturn = Item;

export function toItem(data: (typeof neoItemsJson)[number]): ToItemReturn {
  const item: Item = {
    id: data.id,
    neoId: data.neoId,
    type: toItemType(data.type),
    name: data.name,
    description: data.description,
    size: data.size,
    weight: data.weight,
    value: data.value,
    stackLimit: data.stackLimit,
    image: data.image,
    allImages: data.allImages,
  };
  if (data.gridSize !== undefined) {
    item.gridSize = data.gridSize;
  }
  if ('usable' in data && data.usable) {
    item.usable = true;
  }
  return item;
}
