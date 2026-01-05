import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import { buildDestinationItems } from '../utils/buildDestinationItems';
import { findFirstAvailableContainer } from '../utils/findFirstAvailableContainer';

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
    // TODO: Re-enable when item quantity tracking is added
    show: (): boolean => false,
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
    show: (ctx: UseMenuContextReturn): boolean => ctx.source === 'ground',
    disabled: (ctx: UseMenuContextReturn): boolean => findFirstAvailableContainer(ctx) === null,
  },
];
