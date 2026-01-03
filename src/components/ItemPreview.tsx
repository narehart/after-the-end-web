import type { Item } from '../types/inventory';
import { ItemDisplay } from './primitives';

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
  return <ItemDisplay item={item} imageClassName={imageClassName} iconClassName={iconClassName} />;
}
