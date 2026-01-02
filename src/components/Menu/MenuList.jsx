import classNames from 'classnames/bind';
import MenuItem from './MenuItem';
import styles from './Menu.module.css';

const cx = classNames.bind(styles);

export default function MenuList({
  items,
  context,
  focusIndex,
  selectedId,
  onSelect,
  onSetFocusIndex,
  onHoverItem,
  emptyMessage = 'No options available',
}) {
  if (!items || items.length === 0) {
    return <div className={cx('menu-empty')}>{emptyMessage}</div>;
  }

  const getMouseEnterHandler = (index) => {
    if (onSetFocusIndex) return () => onSetFocusIndex(index);
    if (onHoverItem) return () => onHoverItem(index);
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
