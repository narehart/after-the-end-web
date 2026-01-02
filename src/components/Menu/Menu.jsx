import { useEffect, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../../stores/inventoryStore';
import useMenuContext from '../../hooks/useMenuContext';
import { useMenuLevels } from '../../hooks/useMenuItems';
import useMenuKeyboard from '../../hooks/useMenuKeyboard';
import Breadcrumb from '../Breadcrumb';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const cx = classNames.bind(styles);

function useBreadcrumbLinks(path, item, menuNavigateToLevel) {
  return useMemo(() => {
    const itemName = item?.name || 'Actions';
    const links = [
      { label: itemName, onClick: path.length > 0 ? () => menuNavigateToLevel(0) : undefined },
    ];
    path.forEach((segment, idx) => {
      const isLast = idx === path.length - 1;
      links.push({
        label: segment.label,
        onClick: isLast ? undefined : () => menuNavigateToLevel(idx + 1),
      });
    });
    return links;
  }, [path, menuNavigateToLevel, item?.name]);
}

function useMenuActions(context, menuNavigateTo) {
  return useCallback(
    (item) => {
      if (item.type === 'navigate' && item.getItems) {
        menuNavigateTo({ id: item.id, label: item.label });
      } else if (item.type === 'select' && item.data) {
        const { unequipItem, closeMenu } = context;
        if (item.data.action === 'unequip') unequipItem(context.itemId, item.data.containerId);
        closeMenu();
      } else if (item.type === 'action') {
        const { navigateToContainer, rotateItem, equipItem, closeMenu } = context;
        if (item.id === 'open') {
          navigateToContainer(context.itemId, context.panel, context.source === 'equipment');
          closeMenu();
        } else if (item.id === 'rotate') {
          rotateItem(context.itemId);
        } else if (item.id === 'equip') {
          equipItem(context.itemId);
          closeMenu();
        } else {
          closeMenu();
        }
      }
    },
    [context, menuNavigateTo]
  );
}

export default function Menu() {
  const menuRef = useRef(null);
  const menu = useInventoryStore((s) => s.menu);
  const closeMenu = useInventoryStore((s) => s.closeMenu);
  const menuNavigateTo = useInventoryStore((s) => s.menuNavigateTo);
  const menuNavigateBack = useInventoryStore((s) => s.menuNavigateBack);
  const menuNavigateToLevel = useInventoryStore((s) => s.menuNavigateToLevel);
  const menuSetFocusIndex = useInventoryStore((s) => s.menuSetFocusIndex);
  const context = useMenuContext(menu);
  const levels = useMenuLevels(menu.path, context);
  const currentLevel = levels[levels.length - 1];
  const handleSelect = useMenuActions(context, menuNavigateTo);

  useMenuKeyboard({
    items: currentLevel?.items || [],
    focusIndex: menu.focusIndex,
    path: menu.path,
    isOpen: menu.isOpen,
    onNavigateBack: menuNavigateBack,
    onClose: closeMenu,
    onSelect: handleSelect,
    onSetFocus: menuSetFocusIndex,
  });

  useEffect(() => {
    if (menu.isOpen) menuRef.current?.focus();
  }, [menu.isOpen]);

  const breadcrumbLinks = useBreadcrumbLinks(menu.path, context.item, menuNavigateToLevel);

  if (!menu.isOpen) return null;

  const itemIcon = context.item?.image ? `/src/assets/items/${context.item.image}` : null;

  return (
    <div ref={menuRef} className={cx('menu-modal')} tabIndex={-1}>
      <Breadcrumb links={breadcrumbLinks} icon={itemIcon} clipLinks />
      <MenuList
        items={currentLevel?.items || []}
        context={context}
        focusIndex={menu.focusIndex}
        onSelect={handleSelect}
        onSetFocusIndex={menuSetFocusIndex}
        emptyMessage={menu.path.length > 0 ? 'No containers here' : 'No actions available'}
      />
    </div>
  );
}
