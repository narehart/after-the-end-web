import type { Item, ItemType } from '../types/inventory';

const icons: Record<ItemType, string> = {
  container: '📦',
  consumable: '💊',
  weapon: '🗡',
  clothing: '👔',
  ammo: '🔸',
  tool: '🔦',
  accessory: '🔹',
};

function getItemIcon(type: ItemType): string {
  return icons[type];
}

interface ItemPreviewProps {
  item: Item;
  imageClassName?: string;
  iconClassName?: string;
}

export default function ItemPreview({
  item,
  imageClassName,
  iconClassName,
}: ItemPreviewProps): React.JSX.Element {
  if (item.image !== '') {
    return (
      <img
        src={`/src/assets/items/${item.image}`}
        alt={item.name}
        className={imageClassName}
        draggable={false}
      />
    );
  }
  return (
    <span className={iconClassName} style={{ transform: `rotate(${String(item.rotation)}deg)` }}>
      {getItemIcon(item.type)}
    </span>
  );
}
