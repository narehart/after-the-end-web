const IMAGES_BASE_PATH = '/src/assets/images';

export function getImageUrl(filename: string): string {
  return `${IMAGES_BASE_PATH}/${filename}`;
}
