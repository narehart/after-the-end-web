/**
 * Get Item By ID
 *
 * Looks up an item template by its ID.
 */

import type { Item } from '../types/inventory';
import { itemTemplates } from './itemTemplates';

type GetItemByIdReturn = Item | undefined;

export function getItemById(id: string): GetItemByIdReturn {
  return itemTemplates[id];
}
