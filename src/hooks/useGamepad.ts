import { useEffect, useRef, useCallback, useState } from 'react';
import { REPEAT_DELAY, REPEAT_RATE } from '../constants/input';
import type { NavigationDirection } from '../types/input';
import { findFirstGamepad } from '../utils/findFirstGamepad';
import { processGamepad } from '../utils/processGamepad';
import type { GamepadRefs, GamepadCallbacks } from '../utils/processGamepad';
import { updateConnectionState } from '../utils/updateConnectionState';

interface UseGamepadProps {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
  onSelect?: (() => void) | undefined;
  enabled?: boolean | undefined;
}

interface UseGamepadReturn {
  isConnected: boolean;
  gamepadName: string;
}

export function useGamepad({
  onNavigate,
  onConfirm,
  onBack,
  onNextPanel,
  onPrevPanel,
  onSelect,
  enabled = true,
}: UseGamepadProps): UseGamepadReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');
  const isConnectedRef = useRef(false);
  const lastButtonStates = useRef<Record<number, boolean>>({});
  const lastAxisStates = useRef({ x: 0, y: 0 });
  const repeatTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const frameRef = useRef<number | undefined>(undefined);

  const clearRepeatTimer = useCallback((key: string): void => {
    const timer = repeatTimers.current[key];
    if (timer !== undefined) {
      clearTimeout(timer);
      delete repeatTimers.current[key];
    }
  }, []);

  const startRepeat = useCallback(
    (key: string, action: () => void): void => {
      clearRepeatTimer(key);
      const repeat = (): void => {
        action();
        repeatTimers.current[key] = setTimeout(repeat, REPEAT_RATE);
      };
      repeatTimers.current[key] = setTimeout(repeat, REPEAT_DELAY);
    },
    [clearRepeatTimer]
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const refs: GamepadRefs = { lastButtonStates, lastAxisStates };
    const callbacks: GamepadCallbacks = {
      onNavigate,
      onConfirm,
      onBack,
      onNextPanel,
      onPrevPanel,
      onSelect,
      startRepeat,
      clearRepeatTimer,
    };

    const pollGamepad = (): void => {
      const gamepad = findFirstGamepad();
      updateConnectionState(gamepad, isConnectedRef, setIsConnected, setGamepadName);
      if (gamepad !== null) processGamepad({ gamepad, refs, callbacks });
      frameRef.current = requestAnimationFrame(pollGamepad);
    };

    frameRef.current = requestAnimationFrame(pollGamepad);
    const currentRepeatTimers = repeatTimers.current;

    return (): void => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      Object.values(currentRepeatTimers).forEach(clearTimeout);
    };
  }, [
    enabled,
    onNavigate,
    onConfirm,
    onBack,
    onNextPanel,
    onPrevPanel,
    onSelect,
    startRepeat,
    clearRepeatTimer,
  ]);

  return { isConnected, gamepadName };
}
