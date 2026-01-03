import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FIRST_INDEX, SECOND_INDEX, NOT_FOUND_INDEX } from '../constants/numbers';
import { useInventoryStore } from '../stores/inventoryStore';
import { getImageUrl } from '../utils/images';
import { useBreadcrumbLinksMenu } from '../hooks/useBreadcrumbLinksMenu';
import { useMenuActions } from '../hooks/useMenuActions';
import useMenuContext from '../hooks/useMenuContext';
import useMenuLevels from '../hooks/useMenuLevels';
import useMenuKeyboard from '../hooks/useMenuKeyboard';
import Breadcrumb from './Breadcrumb';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const cx = classNames.bind(styles);

export default function Menu(): React.JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const menu = useInventoryStore((s) => s.menu);
  const closeMenu = useInventoryStore((s) => s.closeMenu);
  const menuNavigateTo = useInventoryStore((s) => s.menuNavigateTo);
  const menuNavigateBack = useInventoryStore((s) => s.menuNavigateBack);
  const menuNavigateToLevel = useInventoryStore((s) => s.menuNavigateToLevel);
  const menuSetFocusIndex = useInventoryStore((s) => s.menuSetFocusIndex);
  const context = useMenuContext({ menu });
  const levels = useMenuLevels(menu.path, context);
  const currentLevel =
    levels.length > FIRST_INDEX ? levels[levels.length - SECOND_INDEX] : undefined;
  const handleSelect = useMenuActions({ context }, menuNavigateTo);
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

  const breadcrumbLinks = useBreadcrumbLinksMenu(menu.path, context.item, menuNavigateToLevel);

  if (!menu.isOpen) return null;

  const itemImage = context.item?.image;
  const itemIcon = itemImage !== undefined ? getImageUrl(itemImage) : undefined;

  return (
    <>
      <div
        className={cx('menu-overlay')}
        onClick={closeMenu}
        onKeyDown={(e): void => {
          if (e.key === 'Escape') closeMenu();
        }}
        role="button"
        tabIndex={NOT_FOUND_INDEX}
        aria-label="Close menu"
      />
      <div ref={menuRef} className={cx('menu-modal')} tabIndex={NOT_FOUND_INDEX}>
        <Breadcrumb links={breadcrumbLinks} icon={itemIcon} clipLinks />
        <MenuList
          items={currentItems}
          context={context}
          focusIndex={menu.focusIndex}
          onSelect={handleSelect}
          onSetFocusIndex={menuSetFocusIndex}
          emptyMessage={
            menu.path.length > FIRST_INDEX ? 'No containers here' : 'No actions available'
          }
        />
      </div>
    </>
  );
}
