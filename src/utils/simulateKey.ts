export function simulateKey(key: string): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  document.activeElement?.dispatchEvent(event);
}
