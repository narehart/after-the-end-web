import type { MutableRefObject } from 'react';
import { BUTTONS } from '../constants/gamepad';
import type { NavigationDirection } from '../types/gamepad';
import { createButtonHandler } from './createButtonHandler';
import { handleStickAxis } from './handleStickAxis';

export interface GamepadRefs {
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  lastAxisStates: MutableRefObject<{ x: number; y: number }>;
}

export interface GamepadCallbacks {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

export function processGamepad(
  gamepad: Gamepad,
  refs: GamepadRefs,
  callbacks: GamepadCallbacks
): void {
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
