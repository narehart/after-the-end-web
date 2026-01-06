/**
 * Build Item Templates
 *
 * Builds a map of item templates from JSON data.
 */

import type { ItemsMap } from '../types/inventory';
import neoItemsJson from '../data/neoItems.json';
import { toItem } from './toItem';

type BuildItemTemplatesReturn = ItemsMap;

export function buildItemTemplates(): BuildItemTemplatesReturn {
  const templates: ItemsMap = {};
  for (const data of neoItemsJson) {
    templates[data.id] = toItem(data);
  }
  return templates;
}
