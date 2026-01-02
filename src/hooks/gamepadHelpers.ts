import type { MutableRefObject } from 'react';
import { BUTTONS, STICK_THRESHOLD } from '../constants/gamepad';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export { BUTTONS };

export function crossedPositiveThreshold(value: number, lastValue: number): boolean {
  return value > STICK_THRESHOLD && lastValue <= STICK_THRESHOLD;
}

export function crossedNegativeThreshold(value: number, lastValue: number): boolean {
  return value < -STICK_THRESHOLD && lastValue >= -STICK_THRESHOLD;
}

export function returnedToCenter(value: number, lastValue: number): boolean {
  return Math.abs(value) <= STICK_THRESHOLD && Math.abs(lastValue) > STICK_THRESHOLD;
}

export type ButtonHandler = (buttonIndex: number, onPress: () => void, key?: string) => void;

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

export function handleStickAxis(
  value: number,
  lastValue: number,
  posDir: NavigationDirection,
  negDir: NavigationDirection,
  posKey: string,
  negKey: string,
  onNavigate: ((dir: NavigationDirection) => void) | undefined,
  startRepeat: (key: string, action: () => void) => void,
  clearRepeatTimer: (key: string) => void
): void {
  if (crossedPositiveThreshold(value, lastValue)) {
    onNavigate?.(posDir);
    startRepeat(posKey, () => {
      onNavigate?.(posDir);
    });
  } else if (crossedNegativeThreshold(value, lastValue)) {
    onNavigate?.(negDir);
    startRepeat(negKey, () => {
      onNavigate?.(negDir);
    });
  } else if (returnedToCenter(value, lastValue)) {
    clearRepeatTimer(posKey);
    clearRepeatTimer(negKey);
  }
}

export function findFirstGamepad(): Gamepad | null {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad !== null) return gamepad;
  }
  return null;
}

export function updateConnectionState(
  gamepad: Gamepad | null,
  isConnectedRef: MutableRefObject<boolean>,
  setIsConnected: (connected: boolean) => void,
  setGamepadName: (name: string) => void
): void {
  if (gamepad !== null && !isConnectedRef.current) {
    isConnectedRef.current = true;
    setIsConnected(true);
    setGamepadName(gamepad.id);
  } else if (gamepad === null && isConnectedRef.current) {
    isConnectedRef.current = false;
    setIsConnected(false);
    setGamepadName('');
  }
}
