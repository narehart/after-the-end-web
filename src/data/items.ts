import type { Item, ItemsMap } from '../types/inventory';
import { toItemType } from '../utils/toItemType';
import neoItemsJson from './neoItems.json';

function toItem(data: (typeof neoItemsJson)[number]): Item {
  const item: Item = {
    id: data.id,
    neoId: data.neoId,
    type: toItemType(data.type),
    name: data.name,
    description: data.description,
    flavorText: data.flavorText,
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
  return item;
}

// Create a lookup map by item ID
export const itemsById: ItemsMap = Object.fromEntries(
  neoItemsJson.map((data) => [data.id, toItem(data)])
);

export function getItemById(id: string): Item | undefined {
  return itemsById[id];
}
