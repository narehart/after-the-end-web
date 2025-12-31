import { useEffect, useRef, useCallback, useState } from 'react';

// Standard button mappings (most controllers follow this after browser normalization)
const BUTTONS = {
  A: 0,        // Confirm (Xbox A, PS Cross, Switch B-position)
  B: 1,        // Back (Xbox B, PS Circle, Switch A-position)
  X: 2,
  Y: 3,
  LB: 4,       // Left bumper
  RB: 5,       // Right bumper
  LT: 6,       // Left trigger
  RT: 7,       // Right trigger
  SELECT: 8,
  START: 9,
  L3: 10,      // Left stick press
  R3: 11,      // Right stick press
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
};

// Axis indices
const AXES = {
  LEFT_X: 0,
  LEFT_Y: 1,
  RIGHT_X: 2,
  RIGHT_Y: 3,
};

const STICK_THRESHOLD = 0.5;
const REPEAT_DELAY = 400;  // ms before repeat starts
const REPEAT_RATE = 100;   // ms between repeats

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

    // Initial delay before repeating
    repeatTimers.current[key] = setTimeout(() => {
      action();
      // Then repeat at regular interval
      const repeat = () => {
        repeatTimers.current[key] = setTimeout(() => {
          action();
          repeat();
        }, REPEAT_RATE);
      };
      repeat();
    }, REPEAT_DELAY);
  }, [clearRepeatTimer]);

  useEffect(() => {
    if (!enabled) return;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      let foundGamepad = false;

      for (const gamepad of gamepads) {
        if (!gamepad) continue;

        foundGamepad = true;
        if (!isConnectedRef.current) {
          isConnectedRef.current = true;
          setIsConnected(true);
          setGamepadName(gamepad.id);
        }

        // Handle buttons
        const handleButton = (buttonIndex, onPress, key) => {
          const pressed = gamepad.buttons[buttonIndex]?.pressed;
          const wasPressed = lastButtonStates.current[buttonIndex];

          if (pressed && !wasPressed) {
            onPress();
            if (key) startRepeat(key, onPress);
          } else if (!pressed && wasPressed) {
            if (key) clearRepeatTimer(key);
          }

          lastButtonStates.current[buttonIndex] = pressed;
        };

        // D-pad navigation
        handleButton(BUTTONS.DPAD_UP, () => onNavigate?.('up'), 'dpad_up');
        handleButton(BUTTONS.DPAD_DOWN, () => onNavigate?.('down'), 'dpad_down');
        handleButton(BUTTONS.DPAD_LEFT, () => onNavigate?.('left'), 'dpad_left');
        handleButton(BUTTONS.DPAD_RIGHT, () => onNavigate?.('right'), 'dpad_right');

        // Action buttons (no repeat)
        handleButton(BUTTONS.A, () => onConfirm?.());
        handleButton(BUTTONS.B, () => onBack?.());
        handleButton(BUTTONS.RB, () => onNextPanel?.());
        handleButton(BUTTONS.LB, () => onPrevPanel?.());

        // Left stick navigation
        const stickX = gamepad.axes[AXES.LEFT_X] || 0;
        const stickY = gamepad.axes[AXES.LEFT_Y] || 0;
        const lastX = lastAxisStates.current.x;
        const lastY = lastAxisStates.current.y;

        // Horizontal stick
        if (stickX > STICK_THRESHOLD && lastX <= STICK_THRESHOLD) {
          onNavigate?.('right');
          startRepeat('stick_right', () => onNavigate?.('right'));
        } else if (stickX < -STICK_THRESHOLD && lastX >= -STICK_THRESHOLD) {
          onNavigate?.('left');
          startRepeat('stick_left', () => onNavigate?.('left'));
        } else if (Math.abs(stickX) <= STICK_THRESHOLD && Math.abs(lastX) > STICK_THRESHOLD) {
          clearRepeatTimer('stick_left');
          clearRepeatTimer('stick_right');
        }

        // Vertical stick
        if (stickY > STICK_THRESHOLD && lastY <= STICK_THRESHOLD) {
          onNavigate?.('down');
          startRepeat('stick_down', () => onNavigate?.('down'));
        } else if (stickY < -STICK_THRESHOLD && lastY >= -STICK_THRESHOLD) {
          onNavigate?.('up');
          startRepeat('stick_up', () => onNavigate?.('up'));
        } else if (Math.abs(stickY) <= STICK_THRESHOLD && Math.abs(lastY) > STICK_THRESHOLD) {
          clearRepeatTimer('stick_up');
          clearRepeatTimer('stick_down');
        }

        lastAxisStates.current = { x: stickX, y: stickY };

        // Only process first connected gamepad
        break;
      }

      // Handle disconnection
      if (!foundGamepad && isConnectedRef.current) {
        isConnectedRef.current = false;
        setIsConnected(false);
        setGamepadName('');
      }

      frameRef.current = requestAnimationFrame(pollGamepad);
    };

    frameRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      // Clear all repeat timers
      Object.keys(repeatTimers.current).forEach(clearRepeatTimer);
    };
  }, [enabled, onNavigate, onConfirm, onBack, onNextPanel, onPrevPanel, startRepeat, clearRepeatTimer]);

  return { isConnected, gamepadName };
}
