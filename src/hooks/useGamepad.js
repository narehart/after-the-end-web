import { useEffect, useRef, useCallback, useState } from 'react';

const BUTTONS = {
  A: 0, B: 1, LB: 4, RB: 5,
  DPAD_UP: 12, DPAD_DOWN: 13, DPAD_LEFT: 14, DPAD_RIGHT: 15,
};

const STICK_THRESHOLD = 0.5;
const REPEAT_DELAY = 400;
const REPEAT_RATE = 100;

function crossedPositiveThreshold(value, lastValue) {
  return value > STICK_THRESHOLD && lastValue <= STICK_THRESHOLD;
}

function crossedNegativeThreshold(value, lastValue) {
  return value < -STICK_THRESHOLD && lastValue >= -STICK_THRESHOLD;
}

function returnedToCenter(value, lastValue) {
  return Math.abs(value) <= STICK_THRESHOLD && Math.abs(lastValue) > STICK_THRESHOLD;
}

function createButtonHandler(gamepad, lastButtonStates, startRepeat, clearRepeatTimer) {
  return (buttonIndex, onPress, key) => {
    const pressed = gamepad.buttons[buttonIndex]?.pressed;
    const wasPressed = lastButtonStates.current[buttonIndex];

    if (pressed && !wasPressed) {
      onPress();
      if (key) startRepeat(key, onPress);
    } else if (!pressed && wasPressed && key) {
      clearRepeatTimer(key);
    }

    lastButtonStates.current[buttonIndex] = pressed;
  };
}

function handleStickAxis(value, lastValue, posDir, negDir, posKey, negKey, onNavigate, startRepeat, clearRepeatTimer) {
  if (crossedPositiveThreshold(value, lastValue)) {
    onNavigate?.(posDir);
    startRepeat(posKey, () => onNavigate?.(posDir));
  } else if (crossedNegativeThreshold(value, lastValue)) {
    onNavigate?.(negDir);
    startRepeat(negKey, () => onNavigate?.(negDir));
  } else if (returnedToCenter(value, lastValue)) {
    clearRepeatTimer(posKey);
    clearRepeatTimer(negKey);
  }
}

function findFirstGamepad() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad) return gamepad;
  }
  return null;
}

function updateConnectionState(gamepad, isConnectedRef, setIsConnected, setGamepadName) {
  if (gamepad && !isConnectedRef.current) {
    isConnectedRef.current = true;
    setIsConnected(true);
    setGamepadName(gamepad.id);
  } else if (!gamepad && isConnectedRef.current) {
    isConnectedRef.current = false;
    setIsConnected(false);
    setGamepadName('');
  }
}

function processGamepad(gamepad, refs, callbacks) {
  const { lastButtonStates, lastAxisStates } = refs;
  const { onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer } = callbacks;

  const handleButton = createButtonHandler(gamepad, lastButtonStates, startRepeat, clearRepeatTimer);

  handleButton(BUTTONS.DPAD_UP, () => onNavigate?.('up'), 'dpad_up');
  handleButton(BUTTONS.DPAD_DOWN, () => onNavigate?.('down'), 'dpad_down');
  handleButton(BUTTONS.DPAD_LEFT, () => onNavigate?.('left'), 'dpad_left');
  handleButton(BUTTONS.DPAD_RIGHT, () => onNavigate?.('right'), 'dpad_right');
  handleButton(BUTTONS.A, () => onConfirm?.());
  handleButton(BUTTONS.B, () => onBack?.());
  handleButton(BUTTONS.RB, () => onNextPanel?.());
  handleButton(BUTTONS.LB, () => onPrevPanel?.());

  const stickX = gamepad.axes[0] || 0;
  const stickY = gamepad.axes[1] || 0;
  const { x: lastX, y: lastY } = lastAxisStates.current;

  handleStickAxis(stickX, lastX, 'right', 'left', 'stick_right', 'stick_left', onNavigate, startRepeat, clearRepeatTimer);
  handleStickAxis(stickY, lastY, 'down', 'up', 'stick_down', 'stick_up', onNavigate, startRepeat, clearRepeatTimer);

  lastAxisStates.current = { x: stickX, y: stickY };
}

export function useGamepad({ onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, enabled = true }) {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');
  const isConnectedRef = useRef(false);
  const lastButtonStates = useRef({});
  const lastAxisStates = useRef({ x: 0, y: 0 });
  const repeatTimers = useRef({});
  const frameRef = useRef();

  const clearRepeatTimer = useCallback((key) => {
    if (repeatTimers.current[key]) {
      clearTimeout(repeatTimers.current[key]);
      delete repeatTimers.current[key];
    }
  }, []);

  const startRepeat = useCallback((key, action) => {
    clearRepeatTimer(key);
    repeatTimers.current[key] = setTimeout(function repeat() {
      action();
      repeatTimers.current[key] = setTimeout(repeat, REPEAT_RATE);
    }, REPEAT_DELAY);
  }, [clearRepeatTimer]);

  useEffect(() => {
    if (!enabled) return;

    const refs = { lastButtonStates, lastAxisStates };
    const callbacks = { onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer };

    const pollGamepad = () => {
      const gamepad = findFirstGamepad();
      updateConnectionState(gamepad, isConnectedRef, setIsConnected, setGamepadName);

      if (gamepad) {
        processGamepad(gamepad, refs, callbacks);
      }

      frameRef.current = requestAnimationFrame(pollGamepad);
    };

    frameRef.current = requestAnimationFrame(pollGamepad);
    const currentRepeatTimers = repeatTimers.current;

    return () => {
      cancelAnimationFrame(frameRef.current);
      Object.values(currentRepeatTimers).forEach(clearTimeout);
    };
  }, [enabled, onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer]);

  return { isConnected, gamepadName };
}
