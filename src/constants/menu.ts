import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import { buildDestinationItems } from '../config/menuConfig';
import { FIRST_INDEX } from './numbers';

export const ITEM_ACTION_MENU: MenuItem[] = [
  {
    id: 'open',
    label: 'Open',
    icon: '▶',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.gridSize !== undefined,
  },
  {
    id: 'use',
    label: 'Use',
    icon: '○',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.type === 'consumable',
  },
  {
    id: 'equip',
    label: 'Equip',
    icon: '◆',
    type: 'action',
    // TODO: Re-enable when equippable slots data is added to neoItems.json
    show: (): boolean => false,
  },
  {
    id: 'unequip',
    label: 'Unequip to...',
    icon: '◇',
    type: 'navigate',
    hasChildren: true,
    show: (ctx: UseMenuContextReturn): boolean => ctx.source === 'equipment',
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'unequip'),
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: '↻',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.source === 'grid',
  },
  {
    id: 'split',
    label: 'Split',
    icon: '÷',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => {
      const item = ctx.item;
      return item !== undefined && item.stackLimit > FIRST_INDEX;
    },
  },
  {
    id: 'move',
    label: 'Move to...',
    icon: '→',
    type: 'navigate',
    hasChildren: true,
    show: (ctx: UseMenuContextReturn): boolean => ctx.source !== 'equipment',
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'move'),
  },
];
