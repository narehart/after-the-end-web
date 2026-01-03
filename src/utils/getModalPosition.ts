import type { Position } from '../types/ui';

export function getModalPosition(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}
