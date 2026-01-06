import { SECOND_INDEX } from '../constants/primitives';
import {
  RESOLUTION_FHD_WIDTH,
  RESOLUTION_FHD_HEIGHT,
  RESOLUTION_WQXGA_WIDTH,
  RESOLUTION_WQXGA_HEIGHT,
  RESOLUTION_QHD_HEIGHT,
  RESOLUTION_4K_WIDTH,
  DIAGONAL_LAPTOP_SMALL,
  DIAGONAL_LAPTOP_MEDIUM,
  DIAGONAL_DESKTOP_SMALL,
  DIAGONAL_DESKTOP_LARGE,
} from '../constants/ui';

export function estimateDiagonal(
  physicalWidth: number,
  physicalHeight: number,
  dpr: number
): number {
  const isHiDpi = dpr > SECOND_INDEX;
  // Resolution thresholds for common monitor sizes
  if (physicalWidth <= RESOLUTION_FHD_WIDTH && physicalHeight <= RESOLUTION_FHD_HEIGHT) {
    return isHiDpi ? DIAGONAL_LAPTOP_SMALL : DIAGONAL_DESKTOP_SMALL;
  }
  if (physicalWidth <= RESOLUTION_WQXGA_WIDTH && physicalHeight <= RESOLUTION_WQXGA_HEIGHT) {
    return DIAGONAL_LAPTOP_SMALL;
  }
  if (physicalWidth <= RESOLUTION_WQXGA_WIDTH && physicalHeight <= RESOLUTION_QHD_HEIGHT) {
    return isHiDpi ? DIAGONAL_LAPTOP_MEDIUM : DIAGONAL_DESKTOP_LARGE;
  }
  if (physicalWidth <= RESOLUTION_4K_WIDTH) return DIAGONAL_DESKTOP_LARGE;
  return DIAGONAL_DESKTOP_SMALL;
}
