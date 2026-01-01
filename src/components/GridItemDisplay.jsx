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

export default function GridItemDisplay({ item, hasGrid }) {
  return (
    <div
      className={`grid-item ${hasGrid ? 'container' : ''}`}
      style={{
        width: `${item.size.width * 100}%`,
        height: `${item.size.height * 100}%`,
      }}
    >
      <span className="item-icon">{getItemIcon(item.type)}</span>
      <span className="item-name">{item.name}</span>
      {item.stackable && item.quantity > 1 && (
        <span className="item-quantity">x{item.quantity}</span>
      )}
      {hasGrid && <span className="container-indicator">▼</span>}
    </div>
  );
}
