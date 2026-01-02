import type { RefObject, MutableRefObject } from 'react';
import { useRef, useEffect, useCallback } from 'react';
import { PANELS } from '../constants/navigation';
import type { PanelName } from '../constants/navigation';

interface PanelRefs {
  equipment: RefObject<HTMLDivElement | null>;
  inventory: RefObject<HTMLDivElement | null>;
  world: RefObject<HTMLDivElement | null>;
}

interface UsePanelNavigationReturn {
  focusPanel: (panelIndex: number) => void;
  goToNextPanel: () => void;
  goToPrevPanel: () => void;
  activePanelRef: MutableRefObject<number>;
}

export default function usePanelNavigation(
  refs: PanelRefs,
  modalsOpen: boolean
): UsePanelNavigationReturn {
  const activePanelRef = useRef(0);

  const focusPanel = useCallback(
    (panelIndex: number): void => {
      activePanelRef.current = panelIndex;
      const panel = PANELS[panelIndex];

      if (panel === undefined) return;

      const refMap: Record<PanelName, RefObject<HTMLDivElement | null>> = {
        equipment: refs.equipment,
        inventory: refs.inventory,
        world: refs.world,
      };

      const targetRef = refMap[panel];
      if (targetRef.current !== null) {
        const focusable = targetRef.current.querySelector<HTMLElement>('[tabindex="0"]');
        if (focusable !== null) {
          focusable.focus();
        }
      }
    },
    [refs]
  );

  const goToNextPanel = useCallback((): void => {
    if (modalsOpen) return;
    const newIndex = Math.min(PANELS.length - 1, activePanelRef.current + 1);
    focusPanel(newIndex);
  }, [modalsOpen, focusPanel]);

  const goToPrevPanel = useCallback((): void => {
    if (modalsOpen) return;
    const newIndex = Math.max(0, activePanelRef.current - 1);
    focusPanel(newIndex);
  }, [modalsOpen, focusPanel]);

  // Handle keyboard panel switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (modalsOpen) return;

      if (e.key === '[' || e.key === 'q') {
        e.preventDefault();
        goToPrevPanel();
      } else if (e.key === ']' || e.key === 'e') {
        e.preventDefault();
        goToNextPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalsOpen, goToNextPanel, goToPrevPanel]);

  return {
    focusPanel,
    goToNextPanel,
    goToPrevPanel,
    activePanelRef,
  };
}
