export function findFirstGamepad(): Gamepad | null {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad !== null) return gamepad;
  }
  return null;
}
