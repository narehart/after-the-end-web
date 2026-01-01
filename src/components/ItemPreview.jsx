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

export default function ItemPreview({ item }) {
  if (item.image) {
    return (
      <img
        src={`/src/assets/items/${item.image}`}
        alt={item.name}
        className="preview-image"
        draggable={false}
      />
    );
  }
  return (
    <span
      className="preview-icon"
      style={{ transform: `rotate(${item.rotation}deg)` }}
    >
      {getItemIcon(item.type)}
    </span>
  );
}
