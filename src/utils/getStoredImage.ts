export interface GetStoredImageProps {
  image: string;
  allImages: string[];
}

/**
 * Gets the "Stored" variant of an item's image for compact display.
 * Stored images are cropped versions without the empty space padding
 * used for grid positioning.
 *
 * Falls back to the main image if no stored variant exists.
 */
export function getStoredImage({ image, allImages }: GetStoredImageProps): string {
  const storedImage = allImages.find((img) => img.includes('Stored'));
  return storedImage ?? image;
}
