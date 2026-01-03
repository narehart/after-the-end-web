import type { ItemType } from '../types/inventory';

type ToItemTypeReturn = ItemType;

export function toItemType(value: string): ToItemTypeReturn {
  const typeMap: Record<string, ItemType> = {
    container: 'container',
    consumable: 'consumable',
    weapon: 'weapon',
    clothing: 'clothing',
    ammo: 'ammo',
    tool: 'tool',
    accessory: 'accessory',
    material: 'material',
    misc: 'misc',
    medical: 'medical',
  };
  return typeMap[value] ?? 'misc';
}
