import type { MutableRefObject } from 'react';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export type ThresholdDirection = 'positive' | 'negative';

export interface Position {
  x: number;
  y: number;
}

export interface GamepadRefs {
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  lastAxisStates: MutableRefObject<Position>;
}

export interface GamepadCallbacks {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
  onSelect?: (() => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}
