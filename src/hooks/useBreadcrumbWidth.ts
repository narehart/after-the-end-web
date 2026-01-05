import type { RefObject } from 'react';
import { useLayoutEffect } from 'react';
import measureBreadcrumbWidth from '../utils/measureBreadcrumbWidth';

export default function useBreadcrumbWidth(containerRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const applyWidth = (): void => {
      const container = containerRef.current;
      if (container === null) return;

      const width = measureBreadcrumbWidth(container);
      const buttons = container.querySelectorAll('button');

      buttons.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          btn.style.maxWidth = width !== null ? `${width}px` : '';
        }
      });

      container.style.visibility = 'visible';
    };

    applyWidth();

    const container = containerRef.current;
    const parent = container?.parentElement;

    const resizeObserver = new ResizeObserver(applyWidth);
    if (parent !== null && parent !== undefined) {
      resizeObserver.observe(parent);
    }

    const mutationObserver = new MutationObserver(applyWidth);
    if (container !== null) {
      mutationObserver.observe(container, { childList: true, subtree: true });
    }

    return (): void => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef]);
}
