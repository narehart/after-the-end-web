import type { MutableRefObject } from 'react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { REPEAT_DELAY, REPEAT_RATE } from '../constants/gamepad';
import {
  BUTTONS,
  createButtonHandler,
  handleStickAxis,
  findFirstGamepad,
  updateConnectionState,
} from './gamepadHelpers';
import type { NavigationDirection } from './gamepadHelpers';

export type { NavigationDirection };

interface GamepadRefs {
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  lastAxisStates: MutableRefObject<{ x: number; y: number }>;
}

interface GamepadCallbacks {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

function processGamepad(gamepad: Gamepad, refs: GamepadRefs, callbacks: GamepadCallbacks): void {
  const { lastButtonStates, lastAxisStates } = refs;
  const { onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer } =
    callbacks;

  const handleButton = createButtonHandler(
    gamepad,
    lastButtonStates,
    startRepeat,
    clearRepeatTimer
  );

  handleButton(
    BUTTONS.DPAD_UP,
    () => {
      onNavigate?.('up');
    },
    'dpad_up'
  );
  handleButton(
    BUTTONS.DPAD_DOWN,
    () => {
      onNavigate?.('down');
    },
    'dpad_down'
  );
  handleButton(
    BUTTONS.DPAD_LEFT,
    () => {
      onNavigate?.('left');
    },
    'dpad_left'
  );
  handleButton(
    BUTTONS.DPAD_RIGHT,
    () => {
      onNavigate?.('right');
    },
    'dpad_right'
  );
  handleButton(BUTTONS.A, () => {
    onConfirm?.();
  });
  handleButton(BUTTONS.B, () => {
    onBack?.();
  });
  handleButton(BUTTONS.RB, () => {
    onNextPanel?.();
  });
  handleButton(BUTTONS.LB, () => {
    onPrevPanel?.();
  });

  const stickX = gamepad.axes[0] ?? 0;
  const stickY = gamepad.axes[1] ?? 0;
  const { x: lastX, y: lastY } = lastAxisStates.current;

  handleStickAxis(
    stickX,
    lastX,
    'right',
    'left',
    'stick_right',
    'stick_left',
    onNavigate,
    startRepeat,
    clearRepeatTimer
  );
  handleStickAxis(
    stickY,
    lastY,
    'down',
    'up',
    'stick_down',
    'stick_up',
    onNavigate,
    startRepeat,
    clearRepeatTimer
  );

  lastAxisStates.current = { x: stickX, y: stickY };
}

interface UseGamepadProps {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
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
      startRepeat,
      clearRepeatTimer,
    };

    const pollGamepad = (): void => {
      const gamepad = findFirstGamepad();
      updateConnectionState(gamepad, isConnectedRef, setIsConnected, setGamepadName);
      if (gamepad !== null) processGamepad(gamepad, refs, callbacks);
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
    startRepeat,
    clearRepeatTimer,
  ]);

  return { isConnected, gamepadName };
}
