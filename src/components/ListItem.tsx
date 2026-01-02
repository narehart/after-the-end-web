import type { RefObject, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import classNames from 'classnames/bind';
import styles from './ListItem.module.css';

const cx = classNames.bind(styles);

interface ListItemState {
  isFocused?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isEmpty?: boolean;
}

interface ListItemProps {
  icon?: ReactNode | undefined;
  label: ReactNode;
  meta?: ReactNode | undefined;
  hasArrow?: boolean | undefined;
  state?: ListItemState | undefined;
  onClick?: (() => void) | undefined;
  onDoubleClick?: (() => void) | undefined;
  onContextMenu?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
  onKeyDown?: ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined;
  onMouseEnter?: (() => void) | undefined;
  className?: string | undefined;
  itemRef?: RefObject<HTMLButtonElement | null> | undefined;
}

export default function ListItem({
  icon,
  label,
  meta,
  hasArrow,
  state = {},
  onClick,
  onDoubleClick,
  onContextMenu,
  onKeyDown,
  onMouseEnter,
  className: extraClassName,
  itemRef,
}: ListItemProps): React.JSX.Element {
  const buttonClasses = cx('list-item', {
    focused: state.isFocused,
    active: state.isActive,
    selected: state.isSelected,
    disabled: state.isDisabled,
    empty: state.isEmpty,
  });

  return (
    <button
      ref={itemRef}
      className={
        extraClassName !== undefined ? `${buttonClasses} ${extraClassName}` : buttonClasses
      }
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      disabled={state.isDisabled}
      tabIndex={0}
      role="option"
      aria-selected={state.isFocused}
    >
      {icon !== null && icon !== undefined ? (
        <span className={cx('list-item-icon')}>{icon}</span>
      ) : null}
      <span className={cx('list-item-label')}>{label}</span>
      {meta !== null && meta !== undefined ? (
        <span className={cx('list-item-meta')}>{meta}</span>
      ) : null}
      {hasArrow === true ? <span className={cx('list-item-arrow')}>›</span> : null}
    </button>
  );
}
