import { useEffect } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { NAVIGATION_KEYS } from '../constants/input';

export default function useInputModeDetection(): void {
  const setInputMode = useInventoryStore((s) => s.setInputMode);
  const inputMode = useInventoryStore((s) => s.inputMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (NAVIGATION_KEYS.has(e.key)) {
        setInputMode('keyboard');
        document.documentElement.dataset['inputMode'] = 'keyboard';
      }
    };

    const handlePointerActivity = (): void => {
      if (inputMode !== 'pointer') {
        setInputMode('pointer');
        document.documentElement.dataset['inputMode'] = 'pointer';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointermove', handlePointerActivity);
    document.addEventListener('pointerdown', handlePointerActivity);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointermove', handlePointerActivity);
      document.removeEventListener('pointerdown', handlePointerActivity);
    };
  }, [setInputMode, inputMode]);
}
