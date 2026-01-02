import { IMAGES_BASE_PATH } from '../constants/images';

export function getImageUrl(filename: string): string {
  return `${IMAGES_BASE_PATH}/${filename}`;
}
