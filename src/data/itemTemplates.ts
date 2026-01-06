/**
 * Item Templates
 *
 * Loads item template definitions from JSON.
 * Templates define the base properties of item types.
 * Instances are created from templates with unique IDs.
 */

import type { Item, ItemsMap } from '../types/inventory';
import { toItemType } from '../utils/toItemType';
import neoItemsArray from './neoItems.json';

function toItem(data: (typeof neoItemsArray)[number]): Item {
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
  return item;
}

function buildTemplatesMap(): ItemsMap {
  const templates: ItemsMap = {};
  for (const data of neoItemsArray) {
    templates[data.id] = toItem(data);
  }
  return templates;
}

/** Map of template ID → Item template */
export const itemTemplates: ItemsMap = buildTemplatesMap();
