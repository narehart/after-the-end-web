import type { MutableRefObject } from 'react';

interface CreateButtonHandlerProps {
  gamepad: Gamepad;
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

type CreateButtonHandlerReturn = (buttonIndex: number, onPress: () => void, key?: string) => void;

export function createButtonHandler(props: CreateButtonHandlerProps): CreateButtonHandlerReturn {
  const { gamepad, lastButtonStates, startRepeat, clearRepeatTimer } = props;
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
