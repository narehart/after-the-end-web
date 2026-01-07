import { REFERENCE_WIDTH, REFERENCE_HEIGHT, DEFAULT_SCALE } from '../constants/ui';
import type { ViewportMode } from '../types/settings';

interface CalculateViewportScaleProps {
  viewportMode: ViewportMode;
  uiScale: number;
}

export function calculateViewportScale(props: CalculateViewportScaleProps): number {
  const { viewportMode, uiScale } = props;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const widthRatio = viewportWidth / REFERENCE_WIDTH;
  const heightRatio = viewportHeight / REFERENCE_HEIGHT;

  let baseScale: number;

  if (viewportMode === 'scale-to-fill') {
    // Scale up to fill the viewport (use the larger ratio)
    baseScale = Math.max(widthRatio, heightRatio);
  } else {
    // Letterbox: fit within viewport (use the smaller ratio)
    // Cap at DEFAULT_SCALE to only scale down, never up
    baseScale = Math.min(widthRatio, heightRatio, DEFAULT_SCALE);
  }

  // Apply user's UI scale preference on top
  return baseScale * uiScale;
}
