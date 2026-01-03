import type { Item } from '../types/inventory';
import type { TextSize } from '../types/ui';
import { ItemDisplay } from './primitives';

interface ItemPreviewProps {
  item: Item;
  imageClassName?: string;
  iconSize?: TextSize;
}

export default function ItemPreview({
  item,
  imageClassName,
  iconSize,
}: ItemPreviewProps): React.JSX.Element {
  return <ItemDisplay item={item} imageClassName={imageClassName} iconSize={iconSize} />;
}
