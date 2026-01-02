export function estimateDiagonal(
  physicalWidth: number,
  physicalHeight: number,
  dpr: number
): number {
  const isHiDpi = dpr > 1;
  // Resolution thresholds for common monitor sizes
  if (physicalWidth <= 1920 && physicalHeight <= 1080) return isHiDpi ? 14 : 24;
  if (physicalWidth <= 2560 && physicalHeight <= 1600) return 14;
  if (physicalWidth <= 2560 && physicalHeight <= 1440) return isHiDpi ? 15.6 : 27;
  if (physicalWidth <= 3840) return 27;
  return 24;
}
