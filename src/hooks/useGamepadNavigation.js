import { useCallback } from 'react';
import { useGamepad } from './useGamepad';

function simulateKey(key) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  document.activeElement?.dispatchEvent(event);
}

export default function useGamepadNavigation({ onNextPanel, onPrevPanel, enabled = true }) {
  const handleNavigate = useCallback((direction) => {
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    simulateKey(keyMap[direction]);
  }, []);

  const handleConfirm = useCallback(() => {
    simulateKey('Enter');
  }, []);

  const handleBack = useCallback(() => {
    simulateKey('Escape');
  }, []);

  return useGamepad({
    onNavigate: handleNavigate,
    onConfirm: handleConfirm,
    onBack: handleBack,
    onNextPanel,
    onPrevPanel,
    enabled,
  });
}
