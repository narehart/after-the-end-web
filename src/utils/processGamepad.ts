import { BUTTONS } from '../constants/gamepad';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import type { ProcessGamepadProps } from '../types/utils';
import { createButtonHandler } from './createButtonHandler';
import { handleStickAxis } from './handleStickAxis';

;

export type { GamepadCallbacks, GamepadRefs } from '../types/ui';

export function processGamepad(props: ProcessGamepadProps): void {
  const { gamepad, refs, callbacks } = props;
  const { lastButtonStates, lastAxisStates } = refs;
  const { onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer } =
    callbacks;

  const handleButton = createButtonHandler({
    gamepad,
    lastButtonStates,
    startRepeat,
    clearRepeatTimer,
  });

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

  const stickX = gamepad.axes[FIRST_INDEX] ?? FIRST_INDEX;
  const stickY = gamepad.axes[SECOND_INDEX] ?? FIRST_INDEX;
  const { x: lastX, y: lastY } = lastAxisStates.current;

  handleStickAxis({
    value: stickX,
    lastValue: lastX,
    posDir: 'right',
    negDir: 'left',
    posKey: 'stick_right',
    negKey: 'stick_left',
    onNavigate,
    startRepeat,
    clearRepeatTimer,
  });
  handleStickAxis({
    value: stickY,
    lastValue: lastY,
    posDir: 'down',
    negDir: 'up',
    posKey: 'stick_down',
    negKey: 'stick_up',
    onNavigate,
    startRepeat,
    clearRepeatTimer,
  });

  lastAxisStates.current = { x: stickX, y: stickY };
}
