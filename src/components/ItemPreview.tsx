import type { Item } from '../types/inventory';
import { getImageUrl } from '../utils/images';
import { getItemIcon } from '../utils/getItemIcon';

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
        src={getImageUrl(item.image)}
        alt={item.name}
        className={imageClassName}
        draggable={false}
      />
    );
  }
  return <span className={iconClassName}>{getItemIcon({ type: item.type })}</span>;
}
