import { useState, useEffect } from 'react';

export default function useModalKeyboard({ actions, isActive, onAction, onClose }) {
  const [focusedAction, setFocusedAction] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handlers = {
      ArrowUp: (e) => {
        e.preventDefault();
        setFocusedAction((prev) => (prev > 0 ? prev - 1 : actions.length - 1));
      },
      ArrowDown: (e) => {
        e.preventDefault();
        setFocusedAction((prev) => (prev < actions.length - 1 ? prev + 1 : 0));
      },
      Enter: (e) => {
        e.preventDefault();
        if (isReady) onAction(actions[focusedAction].id);
      },
      Escape: (e) => {
        e.preventDefault();
        onClose();
      },
    };
    handlers[' '] = handlers.Enter;

    const handleKeyDown = (e) => {
      const handler = handlers[e.key];
      if (handler) handler(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedAction, actions, isReady, isActive, onAction, onClose]);

  return { focusedAction, setFocusedAction };
}
