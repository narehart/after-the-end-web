import type { Item } from '../types/inventory';
import { getImageUrl } from '../utils/images';
import { getItemIcon } from '../utils/getItemIcon';
import { getMainImage } from '../utils/getMainImage';

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
  const mainImage = getMainImage({ allImages: item.allImages });
  if (mainImage !== '') {
    return (
      <img
        src={getImageUrl(mainImage)}
        alt={item.name}
        className={imageClassName}
        draggable={false}
      />
    );
  }
  return <span className={iconClassName}>{getItemIcon({ type: item.type })}</span>;
}
