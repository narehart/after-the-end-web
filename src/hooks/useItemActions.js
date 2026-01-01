import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

const ACTION_DEFINITIONS = [
  { id: 'open', label: 'Open', icon: '▶', condition: (ctx) => ctx.hasGrid },
  { id: 'use', label: 'Use', icon: '○', condition: (ctx) => ctx.canUse },
  { id: 'equip', label: 'Equip', icon: '◆', condition: (ctx) => ctx.canEquip },
  { id: 'unequip', label: 'Unequip to...', icon: '◇', condition: (ctx) => ctx.isEquipped },
  { id: 'rotate', label: 'Rotate', icon: '↻', condition: (ctx) => ctx.isInGrid },
  { id: 'split', label: 'Split', icon: '÷', condition: (ctx) => ctx.canSplit },
  { id: 'move', label: 'Move to...', icon: '→', condition: (ctx) => !ctx.isEquipped },
];

function buildActions(item, context) {
  const ctx = {
    hasGrid: item?.gridSize != null,
    isEquipped: context === 'equipment',
    isInGrid: context === 'grid',
    canEquip: item?.equippableSlots?.length > 0 && context !== 'equipment',
    canUse: item?.type === 'consumable',
    canSplit: item?.stackable && item?.quantity > 1,
  };

  return ACTION_DEFINITIONS
    .filter((action) => action.condition(ctx))
    .map(({ id, label, icon }) => ({ id, label, icon }));
}

export default function useItemActions(item, context, onClose, onDestinationPick) {
  const navigateToContainer = useInventoryStore((state) => state.navigateToContainer);
  const rotateItem = useInventoryStore((state) => state.rotateItem);
  const equipItem = useInventoryStore((state) => state.equipItem);

  const isEquipped = context === 'equipment';
  const isInWorld = context === 'ground' || context === 'world';
  const panel = isInWorld ? 'world' : 'inventory';

  const actions = useMemo(() => buildActions(item, context), [item, context]);

  const handleAction = useCallback((actionId) => {
    if (actionId === 'open') {
      navigateToContainer(item.id, panel, isEquipped);
      onClose();
    } else if (actionId === 'rotate') {
      rotateItem(item.id);
    } else if (actionId === 'unequip' || actionId === 'move') {
      onDestinationPick?.(actionId);
    } else if (actionId === 'equip') {
      equipItem(item.id);
      onClose();
    } else {
      onClose();
    }
  }, [item?.id, panel, isEquipped, navigateToContainer, rotateItem, equipItem, onDestinationPick, onClose]);

  return { actions, handleAction };
}
