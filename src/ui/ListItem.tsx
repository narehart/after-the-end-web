import { useState, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import styles from './ListItem.module.css';

const cx = classNames.bind(styles);

interface ListItemProps {
  children: ReactNode;
  selected?: boolean;
  focused?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ListItem({
  children,
  selected,
  focused: _focused,
  active,
  disabled,
  className,
}: ListItemProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const inputMode = useInventoryStore((s) => s.inputMode);

  // Pointer mode uses JS hover tracking, keyboard mode uses CSS :has(focus-visible)
  const showHoverHighlight = inputMode === 'pointer' && isHovered && disabled !== true;

  const itemClass = cx('list-item', {
    'list-item--selected': selected,
    'list-item--focused': showHoverHighlight,
    'list-item--active': active,
    'list-item--disabled': disabled,
  });
  const fullClassName = className !== undefined ? `${itemClass} ${className}` : itemClass;

  return (
    <div
      className={fullClassName}
      onMouseEnter={(): void => {
        setIsHovered(true);
      }}
      onMouseLeave={(): void => {
        setIsHovered(false);
      }}
    >
      {children}
    </div>
  );
}
