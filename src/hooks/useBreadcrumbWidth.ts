import type { RefObject } from 'react';
import { useState, useEffect } from 'react';
import measureBreadcrumbWidth from '../utils/measureBreadcrumbWidth';

export default function useBreadcrumbWidth(
  containerRef: RefObject<HTMLElement | null>
): number | null {
  const [maxLinkWidth, setMaxLinkWidth] = useState<number | null>(null);

  useEffect(() => {
    const calculateWidth = (): void => {
      if (containerRef.current === null) {
        setMaxLinkWidth(null);
        return;
      }
      setMaxLinkWidth(measureBreadcrumbWidth(containerRef.current));
    };

    calculateWidth();

    const parent = containerRef.current?.parentElement;
    const resizeObserver = new ResizeObserver(calculateWidth);
    if (parent !== null && parent !== undefined) {
      resizeObserver.observe(parent);
    }

    return (): void => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return maxLinkWidth;
}
