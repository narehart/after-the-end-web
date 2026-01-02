export default function MenuItem({
  item,
  context,
  isFocused,
  isSelected,
  onSelect,
  onMouseEnter,
}) {
  const isDisabled = typeof item.disabled === 'function' ? item.disabled(context) : item.disabled;
  const label = typeof item.label === 'function' ? item.label(context) : item.label;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(item);
    }
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter();
    // Auto-open submenus on hover
    if (item.hasChildren && item.getItems && !isDisabled) {
      onSelect(item);
    }
  };

  const className = [
    'menu-item',
    isFocused && 'focused',
    isSelected && 'selected',
    isDisabled && 'disabled',
    item.hasChildren && 'has-children',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={isDisabled}
    >
      {item.icon && <span className="menu-item-icon">{item.icon}</span>}
      <span className="menu-item-label">{label}</span>
      {item.meta && <span className="menu-item-meta">{item.meta}</span>}
      {item.hasChildren && <span className="menu-item-arrow">›</span>}
    </button>
  );
}
