import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import useItemActions from '../hooks/useItemActions';
import useModalKeyboard from '../hooks/useModalKeyboard';
import './ItemActionModal.css';

const ItemActionModal = forwardRef(function ItemActionModal(
  { item, position, onClose, context, onDestinationPick, isActive = true, activeSubmenuAction = null },
  ref
) {
  const modalRef = useRef(null);
  const buttonRefs = useRef({});

  useImperativeHandle(ref, () => modalRef.current);

  const { actions, handleAction } = useItemActions(item, context, onClose, onDestinationPick);
  const { focusedAction, setFocusedAction } = useModalKeyboard({
    actions,
    isActive,
    onAction: handleAction,
    onClose,
  });

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  if (!item) return null;

  return (
    <div
      ref={modalRef}
      className="item-action-modal"
      style={{ left: position.x, top: position.y }}
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
