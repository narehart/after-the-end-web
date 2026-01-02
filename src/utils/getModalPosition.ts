interface Position {
  x: number;
  y: number;
}

export function getModalPosition(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}
