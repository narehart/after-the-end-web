import { useCallback } from 'react';
import type { NavigationDirection } from '../types/gamepad';
import { simulateKey } from '../utils/simulateKey';
import { useGamepad } from './useGamepad';

interface UseGamepadNavigationProps {
  onNextPanel?: () => void;
  onPrevPanel?: () => void;
  enabled?: boolean;
}

interface UseGamepadNavigationReturn {
  isConnected: boolean;
  gamepadName: string;
}

export default function useGamepadNavigation({
  onNextPanel,
  onPrevPanel,
  enabled = true,
}: UseGamepadNavigationProps): UseGamepadNavigationReturn {
  const handleNavigate = useCallback((direction: NavigationDirection): void => {
    const keyMap: Record<NavigationDirection, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    simulateKey(keyMap[direction]);
  }, []);

  const handleConfirm = useCallback((): void => {
    simulateKey('Enter');
  }, []);

  const handleBack = useCallback((): void => {
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
