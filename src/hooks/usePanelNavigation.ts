import type { MutableRefObject, RefObject } from 'react';
import { useRef, useEffect, useCallback } from 'react';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import { PANELS } from '../constants/navigation';
import type { PanelName, PanelRefs } from '../types/ui';

interface UsePanelNavigationProps {
  refs: PanelRefs;
  modalsOpen: boolean;
}

interface UsePanelNavigationReturn {
  focusPanel: (panelIndex: number) => void;
  goToNextPanel: () => void;
  goToPrevPanel: () => void;
  activePanelRef: MutableRefObject<number>;
}

export default function usePanelNavigation(
  props: UsePanelNavigationProps
): UsePanelNavigationReturn {
  const { refs, modalsOpen } = props;
  const activePanelRef = useRef(FIRST_INDEX);

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
    const newIndex = Math.min(PANELS.length - SECOND_INDEX, activePanelRef.current + SECOND_INDEX);
    focusPanel(newIndex);
  }, [modalsOpen, focusPanel]);

  const goToPrevPanel = useCallback((): void => {
    if (modalsOpen) return;
    const newIndex = Math.max(FIRST_INDEX, activePanelRef.current - SECOND_INDEX);
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
