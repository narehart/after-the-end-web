import { useState, useEffect } from 'react';

export default function useGamepadStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');

  useEffect(() => {
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp) {
          setIsConnected(true);
          setGamepadName(gp.id);
          return;
        }
      }
      setIsConnected(false);
      setGamepadName('');
    };

    const handleConnect = (e) => {
      setIsConnected(true);
      setGamepadName(e.gamepad.id);
    };

    const handleDisconnect = () => {
      checkGamepads();
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    checkGamepads();

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  return { isConnected, gamepadName };
}
