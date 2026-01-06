interface GetModalPositionProps {
  element: HTMLElement;
}

interface GetModalPositionReturn {
  x: number;
  y: number;
}

export function getModalPosition(props: GetModalPositionProps): GetModalPositionReturn {
  const { element } = props;
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}
