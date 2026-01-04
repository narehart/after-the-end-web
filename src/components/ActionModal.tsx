import classNames from 'classnames/bind';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import { useInventoryStore } from '../stores/inventoryStore';
import { getImageUrl } from '../utils/images';
import { useBreadcrumbLinksMenu } from '../hooks/useBreadcrumbLinksMenu';
import { useMenuActions } from '../hooks/useMenuActions';
import useMenuContext from '../hooks/useMenuContext';
import useMenuLevels from '../hooks/useMenuLevels';
import useMenuKeyboard from '../hooks/useMenuKeyboard';
import { Modal, Panel } from './shared';
import MenuList from './MenuList';
import styles from './ActionModal.module.css';

const cx = classNames.bind(styles);

export default function ActionModal(): React.JSX.Element | null {
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

  const breadcrumbLinks = useBreadcrumbLinksMenu(menu.path, context.item, menuNavigateToLevel);

  const itemImage = context.item?.image;
  const itemIcon = itemImage !== undefined ? getImageUrl(itemImage) : undefined;

  return (
    <Modal visible={menu.isOpen} onClose={closeMenu} className={cx('action-modal')}>
      <Panel
        breadcrumbLinks={breadcrumbLinks}
        {...(itemIcon !== undefined ? { breadcrumbIcon: itemIcon } : {})}
        emptyMessage={
          menu.path.length > FIRST_INDEX ? 'No containers here' : 'No actions available'
        }
      >
        {currentItems.length > FIRST_INDEX ? (
          <MenuList
            items={currentItems}
            context={context}
            focusIndex={menu.focusIndex}
            onSelect={handleSelect}
            onSetFocusIndex={menuSetFocusIndex}
          />
        ) : null}
      </Panel>
    </Modal>
  );
}
