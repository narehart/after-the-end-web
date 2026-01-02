import classNames from 'classnames/bind';
import styles from './ListItem.module.css';

const cx = classNames.bind(styles);

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
}) {
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
      className={extraClassName ? `${buttonClasses} ${extraClassName}` : buttonClasses}
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
      {icon && <span className={cx('list-item-icon')}>{icon}</span>}
      <span className={cx('list-item-label')}>{label}</span>
      {meta && <span className={cx('list-item-meta')}>{meta}</span>}
      {hasArrow && <span className={cx('list-item-arrow')}>›</span>}
    </button>
  );
}
