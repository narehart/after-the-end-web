/**
 * Item Templates
 *
 * Pre-built map of all item templates for lookup.
 */

import type { ItemsMap } from '../types/inventory';
import { buildItemTemplates } from './buildItemTemplates';

/** Map of template ID → Item template */
export const itemTemplates: ItemsMap = buildItemTemplates();
