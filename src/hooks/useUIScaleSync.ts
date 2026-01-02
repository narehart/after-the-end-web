import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { ContainerRect } from '../types/inventory';

export default function useUIScaleSync(
  containerRef: RefObject<HTMLDivElement | null>,
  physicalScale: number,
  setUIScale: (scale: number, containerRect?: ContainerRect | null) => void
): void {
  useEffect(() => {
    const updateScaleAndRect = (): void => {
      const rect = containerRef.current?.getBoundingClientRect();
      setUIScale(
        physicalScale,
        rect !== undefined
          ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
          : null
      );
      document.documentElement.style.setProperty('--ui-scale', String(physicalScale));
    };

    updateScaleAndRect();
    window.addEventListener('resize', updateScaleAndRect);
    return (): void => {
      window.removeEventListener('resize', updateScaleAndRect);
    };
  }, [containerRef, physicalScale, setUIScale]);
}
