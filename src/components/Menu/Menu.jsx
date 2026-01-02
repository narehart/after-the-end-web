import { useEffect, useRef } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import useMenuContext from '../../hooks/useMenuContext';
import { useMenuLevels } from '../../hooks/useMenuItems';
import useMenuKeyboard from '../../hooks/useMenuKeyboard';
import MenuList from './MenuList';
import './Menu.css';

export default function Menu() {
  const menuRef = useRef(null);
  const menu = useInventoryStore((state) => state.menu);
  const closeMenu = useInventoryStore((state) => state.closeMenu);
  const menuNavigateTo = useInventoryStore((state) => state.menuNavigateTo);
  const menuNavigateBack = useInventoryStore((state) => state.menuNavigateBack);
  const menuNavigateToLevel = useInventoryStore((state) => state.menuNavigateToLevel);
  const menuSetFocusIndex = useInventoryStore((state) => state.menuSetFocusIndex);
  const context = useMenuContext(menu);
  const levels = useMenuLevels(menu.path, context);
  const activeLevel = levels.length - 1;
  const activeItems = levels[activeLevel]?.items || [];

  const handleSelect = (item) => {
    if (item.type === 'navigate' && item.getItems) {
      menuNavigateTo({ id: item.id, label: item.label });
    } else if (item.type === 'select' && item.data) {
      handleDestinationSelect(item.data);
    } else if (item.type === 'action') {
      handleAction(item);
    }
  };

  const handleAction = (item) => {
    const { navigateToContainer, rotateItem, equipItem, closeMenu: close } = context;
    const isEquipped = context.source === 'equipment';
    const panel = context.panel;

    if (item.id === 'open') {
      navigateToContainer(context.itemId, panel, isEquipped);
      close();
    } else if (item.id === 'rotate') {
      rotateItem(context.itemId);
    } else if (item.id === 'equip') {
      equipItem(context.itemId);
      close();
    } else {
      close();
    }
  };

  const handleDestinationSelect = (data) => {
    const { unequipItem, closeMenu: close } = context;
    if (data.action === 'unequip') {
      unequipItem(context.itemId, data.containerId);
    }
    close();
  };

  useMenuKeyboard({
    items: activeItems,
    focusIndex: menu.focusIndex,
    path: menu.path,
    isOpen: menu.isOpen,
    onNavigateBack: menuNavigateBack,
    onClose: closeMenu,
    onSelect: handleSelect,
    onSetFocus: menuSetFocusIndex,
  });

  useEffect(() => {
    if (menu.isOpen) {
      menuRef.current?.focus();
    }
  }, [menu.isOpen]);

  if (!menu.isOpen) return null;

  // Calculate cumulative offset for each panel based on parent's selected index
  // Use rem units to match CSS (2.2rem item height)
  const ITEM_HEIGHT_REM = 2.2;

  return (
    <div
      ref={menuRef}
      className="menu-cascade"
      style={{ left: menu.position.x, top: menu.position.y }}
      tabIndex={-1}
    >
      {levels.map((level, index) => {
        // Calculate offset: sum of all previous levels' selected indices
        let offsetRem = 0;
        for (let i = 0; i < index; i++) {
          const prevSelectedIndex = levels[i].selectedIndex;
          if (prevSelectedIndex >= 0) {
            offsetRem += prevSelectedIndex * ITEM_HEIGHT_REM;
          }
        }

        const marginTop = index > 0 ? `${offsetRem}rem` : 0;

        return (
          <div
            key={index}
            className="menu-panel"
            style={{ marginTop }}
          >
            <MenuList
              items={level.items}
              context={context}
              focusIndex={index === activeLevel ? menu.focusIndex : -1}
              selectedId={level.selectedId}
              onSelect={handleSelect}
              onSetFocusIndex={index === activeLevel ? menuSetFocusIndex : undefined}
              onHoverItem={index < activeLevel ? (itemIndex) => menuNavigateToLevel(index, itemIndex) : undefined}
              emptyMessage={index > 0 ? 'No containers here' : 'No actions available'}
            />
          </div>
        );
      })}
    </div>
  );
}
