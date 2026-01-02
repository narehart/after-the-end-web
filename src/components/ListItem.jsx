import './ListItem.css';

function buildClassName(state, extraClassName) {
  return [
    'list-item',
    state.isFocused && 'focused',
    state.isActive && 'active',
    state.isSelected && 'selected',
    state.isDisabled && 'disabled',
    state.isEmpty && 'empty',
    extraClassName,
  ].filter(Boolean).join(' ');
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
}) {
  return (
    <button
      ref={itemRef}
      className={buildClassName(state, extraClassName)}
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
      {icon && <span className="list-item-icon">{icon}</span>}
      <span className="list-item-label">{label}</span>
      {meta && <span className="list-item-meta">{meta}</span>}
      {hasArrow && <span className="list-item-arrow">›</span>}
    </button>
  );
}
