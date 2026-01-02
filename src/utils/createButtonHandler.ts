import type { MutableRefObject } from 'react';
import type { ButtonHandler } from '../types/gamepad';

export function createButtonHandler(
  gamepad: Gamepad,
  lastButtonStates: MutableRefObject<Record<number, boolean>>,
  startRepeat: (key: string, action: () => void) => void,
  clearRepeatTimer: (key: string) => void
): ButtonHandler {
  return (buttonIndex: number, onPress: () => void, key?: string): void => {
    const pressed = gamepad.buttons[buttonIndex]?.pressed ?? false;
    const wasPressed = lastButtonStates.current[buttonIndex] ?? false;

    if (pressed && !wasPressed) {
      onPress();
      if (key !== undefined) startRepeat(key, onPress);
    } else if (!pressed && wasPressed && key !== undefined) {
      clearRepeatTimer(key);
    }

    lastButtonStates.current[buttonIndex] = pressed;
  };
}
