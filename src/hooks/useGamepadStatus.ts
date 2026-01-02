import { useState, useEffect } from 'react';

interface UseGamepadStatusReturn {
  isConnected: boolean;
  gamepadName: string;
}

export default function useGamepadStatus(): UseGamepadStatusReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');

  useEffect(() => {
    const checkGamepads = (): void => {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp !== null) {
          setIsConnected(true);
          setGamepadName(gp.id);
          return;
        }
      }
      setIsConnected(false);
      setGamepadName('');
    };

    const handleConnect = (e: GamepadEvent): void => {
      setIsConnected(true);
      setGamepadName(e.gamepad.id);
    };

    const handleDisconnect = (): void => {
      checkGamepads();
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    checkGamepads();

    return (): void => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  return { isConnected, gamepadName };
}
