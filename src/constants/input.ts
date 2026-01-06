export const NAVIGATION_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
  'Enter',
  'Escape',
  ' ',
]);

export const BUTTONS = {
  A: 0,
  B: 1,
  LB: 4,
  RB: 5,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
} as const;

export const STICK_THRESHOLD = 0.5;

export const REPEAT_DELAY = 400;
export const REPEAT_RATE = 100;
