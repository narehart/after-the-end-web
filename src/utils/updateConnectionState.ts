import type { MutableRefObject } from 'react';

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
