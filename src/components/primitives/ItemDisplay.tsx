import type { Item } from '../../types/inventory';
import { getImageUrl } from '../../utils/images';
import { getItemIcon } from '../../utils/getItemIcon';
import { getMainImage } from '../../utils/getMainImage';
import { Icon, Text } from './index';

interface ItemDisplayProps {
  item: Item;
  imageClassName?: string | undefined;
  iconClassName?: string | undefined;
  showName?: boolean | undefined;
  nameClassName?: string | undefined;
}

export default function ItemDisplay({
  item,
  imageClassName,
  iconClassName,
  showName = false,
  nameClassName,
}: ItemDisplayProps): React.JSX.Element {
  const mainImage = getMainImage({ allImages: item.allImages });
  const hasImage = mainImage !== '';

  return (
    <>
      {hasImage ? (
        <Icon
          src={getImageUrl(mainImage)}
          alt={item.name}
          size="fill"
          pixelated
          className={imageClassName}
        />
      ) : (
        <Text className={iconClassName}>{getItemIcon({ type: item.type })}</Text>
      )}
      {showName ? <Text className={nameClassName}>{item.name}</Text> : null}
    </>
  );
}
