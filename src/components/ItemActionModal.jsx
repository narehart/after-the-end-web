import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import './ItemActionModal.css';

const ItemActionModal = forwardRef(function ItemActionModal({ item, position, onClose, context, onDestinationPick, isActive = true, activeSubmenuAction = null }, ref) {
  const [focusedAction, setFocusedAction] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const modalRef = useRef(null);
  const buttonRefs = useRef({});

  // Forward the ref to the modal element
  useImperativeHandle(ref, () => modalRef.current);
  const navigateToContainer = useInventoryStore((state) => state.navigateToContainer);
  const rotateItem = useInventoryStore((state) => state.rotateItem);
  const equipItem = useInventoryStore((state) => state.equipItem);

  // Delay accepting keyboard input to prevent the opening Enter from triggering an action
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const hasGrid = item?.gridSize != null;
  const isEquipped = context === 'equipment';
  const isInGrid = context === 'grid';
  const isInWorld = context === 'ground' || context === 'world';
  const canEquip = item?.equippableSlots?.length > 0 && !isEquipped;
  const canUse = item?.type === 'consumable';
  const canUnequip = isEquipped;

  // Determine which panel this item belongs to
  const panel = isInWorld ? 'world' : 'inventory';

  // Build action list based on item and context
  const actions = [];

  if (hasGrid) {
    actions.push({ id: 'open', label: 'Open', icon: '▶' });
  }
  if (canUse) {
    actions.push({ id: 'use', label: 'Use', icon: '○' });
  }
  if (canEquip) {
    actions.push({ id: 'equip', label: 'Equip', icon: '◆' });
  }
  if (canUnequip) {
    actions.push({ id: 'unequip', label: 'Unequip to...', icon: '◇' });
  }
  if (isInGrid) {
    actions.push({ id: 'rotate', label: 'Rotate', icon: '↻' });
  }
  if (item?.stackable && item?.quantity > 1) {
    actions.push({ id: 'split', label: 'Split', icon: '÷' });
  }
  if (!isEquipped) {
    actions.push({ id: 'move', label: 'Move to...', icon: '→' });
  }

  const handleAction = useCallback((actionId) => {
    switch (actionId) {
      case 'open':
        navigateToContainer(item.id, panel, isEquipped);
        onClose();
        break;
      case 'rotate':
        rotateItem(item.id);
        // Don't close - let user see rotation
        break;
      case 'unequip':
      case 'move':
        // Open destination picker - position is calculated from DOM in Inventory.jsx
        onDestinationPick?.(actionId);
        break;
      case 'equip':
        equipItem(item.id);
        onClose();
        break;
      case 'use':
      case 'split':
        // TODO: Implement these actions
        console.log(`Action: ${actionId} on item ${item.id}`);
        onClose();
        break;
      default:
        onClose();
    }
  }, [item?.id, panel, isEquipped, navigateToContainer, rotateItem, onDestinationPick, equipItem, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedAction((prev) => (prev > 0 ? prev - 1 : actions.length - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedAction((prev) => (prev < actions.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          // Only accept Enter/Space after modal is ready (prevents opening keypress from triggering)
          if (isReady) {
            handleAction(actions[focusedAction].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedAction, actions, isReady, isActive, handleAction, onClose]);

  // Focus modal on mount
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  if (!item) return null;

  return (
    <div
      ref={modalRef}
      className="item-action-modal"
      style={{
        left: position.x,
        top: position.y,
      }}
      tabIndex={-1}
    >
      <div className="modal-actions">
        {actions.map((action, index) => {
          const hasOpenSubmenu = activeSubmenuAction === action.id;
          const isFocused = index === focusedAction && !hasOpenSubmenu;
          return (
            <button
              key={action.id}
              ref={(el) => { buttonRefs.current[action.id] = el; }}
              className={`modal-action-btn ${isFocused ? 'focused' : ''} ${hasOpenSubmenu ? 'has-submenu' : ''}`}
              onClick={() => handleAction(action.id)}
              onMouseEnter={() => setFocusedAction(index)}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default ItemActionModal;
