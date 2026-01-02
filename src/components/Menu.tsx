import { useEffect, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { getImageUrl } from '../utils/images';
import useMenuContext from '../hooks/useMenuContext';
import { useMenuLevels } from '../hooks/useMenuItems';
import useMenuKeyboard from '../hooks/useMenuKeyboard';
import type {
  BreadcrumbLink,
  Item,
  MenuContext,
  MenuItem as MenuItemType,
  MenuPathSegment,
} from '../types/inventory';
import Breadcrumb from './Breadcrumb';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const cx = classNames.bind(styles);

function useBreadcrumbLinks(
  path: MenuPathSegment[],
  item: Item | undefined,
  menuNavigateToLevel: (level: number) => void
): BreadcrumbLink[] {
  return useMemo(() => {
    const itemName = item?.name ?? 'Actions';
    const links: BreadcrumbLink[] = [
      {
        label: itemName,
        onClick:
          path.length > 0
            ? (): void => {
                menuNavigateToLevel(0);
              }
            : undefined,
      },
    ];
    path.forEach((segment, idx) => {
      const isLast = idx === path.length - 1;
      links.push({
        label: segment.label,
        onClick: isLast
          ? undefined
          : (): void => {
              menuNavigateToLevel(idx + 1);
            },
      });
    });
    return links;
  }, [path, menuNavigateToLevel, item?.name]);
}

function handleNavigateAction(
  item: MenuItemType,
  menuNavigateTo: (s: MenuPathSegment) => void
): void {
  if (item.getItems !== undefined) {
    menuNavigateTo({ id: item.id, label: item.label });
  }
}

function handleSelectAction(item: MenuItemType, context: MenuContext): void {
  const { unequipItem, closeMenu } = context;
  if (item.data?.action === 'unequip' && item.data.containerId !== undefined) {
    unequipItem(context.itemId ?? '', item.data.containerId);
  }
  closeMenu();
}

function handleAction(item: MenuItemType, context: MenuContext): void {
  const { navigateToContainer, rotateItem, equipItem, closeMenu } = context;
  const itemId = context.itemId;
  if (itemId === null) {
    closeMenu();
    return;
  }
  if (item.id === 'open') {
    navigateToContainer(itemId, context.panel, context.source === 'equipment');
    closeMenu();
  } else if (item.id === 'rotate') {
    rotateItem(itemId);
  } else if (item.id === 'equip') {
    equipItem(itemId);
    closeMenu();
  } else {
    closeMenu();
  }
}

function useMenuActions(
  context: MenuContext,
  menuNavigateTo: (segment: MenuPathSegment) => void
): (item: MenuItemType) => void {
  return useCallback(
    (item: MenuItemType): void => {
      switch (item.type) {
        case 'navigate':
          handleNavigateAction(item, menuNavigateTo);
          break;
        case 'select':
          handleSelectAction(item, context);
          break;
        case 'action':
          handleAction(item, context);
          break;
      }
    },
    [context, menuNavigateTo]
  );
}

export default function Menu(): React.JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const menu = useInventoryStore((s) => s.menu);
  const closeMenu = useInventoryStore((s) => s.closeMenu);
  const menuNavigateTo = useInventoryStore((s) => s.menuNavigateTo);
  const menuNavigateBack = useInventoryStore((s) => s.menuNavigateBack);
  const menuNavigateToLevel = useInventoryStore((s) => s.menuNavigateToLevel);
  const menuSetFocusIndex = useInventoryStore((s) => s.menuSetFocusIndex);
  const context = useMenuContext(menu);
  const levels = useMenuLevels(menu.path, context);
  const currentLevel = levels.length > 0 ? levels[levels.length - 1] : undefined;
  const handleSelect = useMenuActions(context, menuNavigateTo);
  const currentItems = currentLevel?.items ?? [];

  useMenuKeyboard({
    items: currentItems,
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

  const itemImage = context.item?.image;
  const itemIcon = itemImage !== undefined ? getImageUrl(itemImage) : undefined;

  return (
    <div ref={menuRef} className={cx('menu-modal')} tabIndex={-1}>
      <Breadcrumb links={breadcrumbLinks} icon={itemIcon} clipLinks />
      <MenuList
        items={currentItems}
        context={context}
        focusIndex={menu.focusIndex}
        onSelect={handleSelect}
        onSetFocusIndex={menuSetFocusIndex}
        emptyMessage={menu.path.length > 0 ? 'No containers here' : 'No actions available'}
      />
    </div>
  );
}
