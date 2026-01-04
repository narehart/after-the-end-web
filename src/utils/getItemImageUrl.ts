import { getImageUrl } from './images';
import { getMainImage } from './getMainImage';

interface GetItemImageUrlProps {
  allImages: string[];
}

export function getItemImageUrl({ allImages }: GetItemImageUrlProps): string {
  return getImageUrl(getMainImage({ allImages }));
}
