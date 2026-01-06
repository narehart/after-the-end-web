import { FIRST_INDEX } from '../constants/primitives';

export interface GetMainImageProps {
  allImages: string[];
}

/**
 * Gets the main display image (non-stored variant).
 * Returns the first image that doesn't have "Stored" in the name.
 */
export function getMainImage({ allImages }: GetMainImageProps): string {
  const mainImage = allImages.find((img) => !img.includes('Stored'));
  return mainImage ?? allImages[FIRST_INDEX] ?? '';
}
