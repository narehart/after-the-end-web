import {
  KNOWN_ASPECT_RATIOS,
  ASPECT_RATIO_TOLERANCE,
  ASPECT_RATIO_LABEL_PRECISION,
} from '../constants/ui';

export function getAspectRatioLabel(width: number, height: number): string {
  const ratio = width / height;

  for (const known of KNOWN_ASPECT_RATIOS) {
    if (Math.abs(ratio - known.ratio) < ASPECT_RATIO_TOLERANCE) {
      return known.label;
    }
  }

  return `${ratio.toFixed(ASPECT_RATIO_LABEL_PRECISION)}:1`;
}
