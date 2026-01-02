import classNames from 'classnames/bind';
import type { MenuItem as MenuItemType, MenuContext } from '../../types/inventory';
import MenuItem from './MenuItem';
import styles from './MenuList.module.css';

const cx = classNames.bind(styles);

interface MenuListProps {
  items: MenuItemType[];
  context: MenuContext;
  focusIndex: number;
  selectedId?: string | null;
  onSelect: (item: MenuItemType) => void;
  onSetFocusIndex?: (index: number) => void;
  onHoverItem?: (index: number) => void;
  emptyMessage?: string;
}

export default function MenuList({
  items,
  context,
  focusIndex,
  selectedId,
  onSelect,
  onSetFocusIndex,
  onHoverItem,
  emptyMessage = 'No options available',
}: MenuListProps): React.JSX.Element {
  if (items.length === 0) {
    return <div className={cx('menu-empty')}>{emptyMessage}</div>;
  }

  const getMouseEnterHandler = (index: number): (() => void) | undefined => {
    if (onSetFocusIndex !== undefined)
      return (): void => {
        onSetFocusIndex(index);
      };
    if (onHoverItem !== undefined)
      return (): void => {
        onHoverItem(index);
      };
    return undefined;
  };

  return (
    <div className={cx('menu-list')}>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          context={context}
          isFocused={index === focusIndex}
          isSelected={item.id === selectedId}
          onSelect={onSelect}
          onMouseEnter={getMouseEnterHandler(index)}
        />
      ))}
    </div>
  );
}
