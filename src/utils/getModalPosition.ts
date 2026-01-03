import type { GetModalPositionProps, GetModalPositionReturn } from '../types/utils';

export function getModalPosition(props: GetModalPositionProps): GetModalPositionReturn {
  const { element } = props;
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}
