import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import { buildDestinationItems } from '../utils/buildDestinationItems';
import { findFirstAvailableContainer } from '../utils/findFirstAvailableContainer';
import { isGridEmpty } from '../utils/isGridEmpty';
import { DEFAULT_QUANTITY } from './numbers';

export const ITEM_ACTION_MENU: MenuItem[] = [
  {
    id: 'open',
    label: 'Open',
    icon: '▶',
    type: 'action',
    show: (): boolean => false, // Hidden: use double-click to open containers
  },
  {
    id: 'use',
    label: 'Use',
    icon: '○',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.usable === true,
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
    show: (): boolean => false, // Hidden: use Drop to unequip
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
    label: 'Split to...',
    icon: '÷',
    type: 'navigate',
    hasChildren: true,
    show: (ctx: UseMenuContextReturn): boolean =>
      (ctx.item?.quantity ?? DEFAULT_QUANTITY) > DEFAULT_QUANTITY,
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'split'),
  },
  {
    id: 'move',
    label: 'Move to...',
    icon: '→',
    type: 'navigate',
    hasChildren: true,
    show: (): boolean => false, // Hidden: use drag-and-drop instead
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'move'),
  },
  {
    id: 'drop',
    label: 'Drop',
    icon: '↓',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.source !== 'ground',
    disabled: (ctx: UseMenuContextReturn): boolean => !ctx.canFitItem('ground'),
  },
  {
    id: 'take',
    label: 'Take',
    icon: '↑',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.panel === 'world',
    disabled: (ctx: UseMenuContextReturn): boolean => findFirstAvailableContainer(ctx) === null,
  },
  {
    id: 'destroy',
    label: 'Destroy',
    icon: '✕',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.source !== 'equipment',
  },
  {
    id: 'empty',
    label: 'Empty out',
    icon: '⤓',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.gridSize !== undefined,
    disabled: (ctx: UseMenuContextReturn): boolean => {
      if (ctx.itemId === null) return true;
      const grid = ctx.grids[ctx.itemId];
      if (grid === undefined) return true;
      return isGridEmpty({ grid });
    },
  },
];
