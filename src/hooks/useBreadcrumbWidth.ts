import type { RefObject } from 'react';
import { useState, useLayoutEffect } from 'react';
import measureBreadcrumbWidth from '../utils/measureBreadcrumbWidth';

export default function useBreadcrumbWidth(
  containerRef: RefObject<HTMLElement | null>
): number | null {
  const [maxLinkWidth, setMaxLinkWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const calculateWidth = (): void => {
      if (containerRef.current === null) {
        setMaxLinkWidth(null);
        return;
      }
      setMaxLinkWidth(measureBreadcrumbWidth(containerRef.current));
    };

    calculateWidth();

    const container = containerRef.current;
    const parent = container?.parentElement;

    const resizeObserver = new ResizeObserver(calculateWidth);
    if (parent !== null && parent !== undefined) {
      resizeObserver.observe(parent);
    }

    const mutationObserver = new MutationObserver(calculateWidth);
    if (container !== null) {
      mutationObserver.observe(container, { childList: true, subtree: true });
    }

    return (): void => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef]);

  return maxLinkWidth;
}
