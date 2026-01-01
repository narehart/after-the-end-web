const CELL_GAP = 2;

function getItemIcon(type) {
  const icons = {
    container: '📦',
    consumable: '💊',
    weapon: '🗡',
    clothing: '👔',
    ammo: '🔸',
    tool: '🔦',
    accessory: '🔹',
  };
  return icons[type] || '◻';
}

function buildClassName(hasGrid, isSelected, hasOpenModal) {
  const classes = ['grid-item'];
  if (hasGrid) classes.push('container');
  if (isSelected) classes.push('selected');
  if (hasOpenModal) classes.push('has-modal');
  return classes.join(' ');
}

function calculateItemDimensions(item, cellSize) {
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}

export default function ItemGridButton({ item, cellSize, cellState, isFocused, handlers }) {
  const { isSelected, hasOpenModal, hasGrid } = cellState;
  const { handleClick, openModal, handleMouseEnter, handleFocus } = handlers;

  const needsRotation = item.size.height > item.size.width && !item.spriteVertical;
  const { itemWidth, itemHeight } = calculateItemDimensions(item, cellSize);

  const handleDoubleClick = (e) => openModal(e.currentTarget);
  const handleContextMenu = (e) => {
    e.preventDefault();
    openModal(e.currentTarget);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') openModal(e.currentTarget);
  };

  return (
    <button
      type="button"
      className={buildClassName(hasGrid, isSelected, hasOpenModal)}
      style={{
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        '--item-width': `${itemWidth}px`,
        '--item-height': `${itemHeight}px`,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={isFocused ? 0 : -1}
      aria-label={item.name}
    >
      {item.image ? (
        <img
          src={`/src/assets/items/${item.image}`}
          alt={item.name}
          className={`item-image ${needsRotation ? 'rotated' : ''}`}
          draggable={false}
        />
      ) : (
        <span className="item-icon">{getItemIcon(item.type)}</span>
      )}
      {item.stackable && item.quantity > 1 && (
        <span className="item-quantity">x{item.quantity}</span>
      )}
      {hasGrid && <span className="container-indicator">▼</span>}
    </button>
  );
}
