import { FIRST_INDEX } from '../constants/numbers';

export interface GetDisplayImageProps {
  allImages: string[];
}

/**
 * Gets the main display image (non-stored variant) for equipment list.
 * Returns the first image that doesn't have "Stored" in the name.
 */
export function getDisplayImage({ allImages }: GetDisplayImageProps): string | null {
  const mainImage = allImages.find((img) => !img.includes('Stored'));
  return mainImage ?? allImages[FIRST_INDEX] ?? null;
}
