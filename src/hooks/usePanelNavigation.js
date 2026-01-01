import { useRef, useEffect, useCallback } from 'react';

const PANELS = ['equipment', 'inventory', 'world'];

export default function usePanelNavigation(refs, modalsOpen) {
  const activePanelRef = useRef(0);

  const focusPanel = useCallback((panelIndex) => {
    activePanelRef.current = panelIndex;
    const panel = PANELS[panelIndex];

    const refMap = {
      equipment: refs.equipment,
      inventory: refs.inventory,
      world: refs.world,
    };

    const targetRef = refMap[panel];
    if (targetRef?.current) {
      const focusable = targetRef.current.querySelector('[tabindex="0"]');
      if (focusable) {
        focusable.focus();
      }
    }
  }, [refs]);

  const goToNextPanel = useCallback(() => {
    if (modalsOpen) return;
    const newIndex = Math.min(PANELS.length - 1, activePanelRef.current + 1);
    focusPanel(newIndex);
  }, [modalsOpen, focusPanel]);

  const goToPrevPanel = useCallback(() => {
    if (modalsOpen) return;
    const newIndex = Math.max(0, activePanelRef.current - 1);
    focusPanel(newIndex);
  }, [modalsOpen, focusPanel]);

  // Handle keyboard panel switching
  useEffect(() => {
    const handleKeyDown = (e) => {
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalsOpen, goToNextPanel, goToPrevPanel]);

  return {
    focusPanel,
    goToNextPanel,
    goToPrevPanel,
    activePanelRef,
  };
}
