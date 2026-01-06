import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import { MIN_LINK_WIDTH } from '../constants/breadcrumb';
import measureFixedWidth from './measureFixedWidth';
import calculateLargeButtonWidth from './calculateLargeButtonWidth';

;

export default function measureBreadcrumbWidth(container: HTMLElement): number | null {
  const parent = container.parentElement;
  if (parent === null) return null;

  const parentStyles = window.getComputedStyle(parent);
  const availableWidth =
    parent.clientWidth -
    parseFloat(parentStyles.paddingLeft) -
    parseFloat(parentStyles.paddingRight);
  if (availableWidth <= FIRST_INDEX) return null;

  const buttons = container.querySelectorAll('button');
  if (buttons.length <= FIRST_INDEX) return null;

  const fixedWidth = measureFixedWidth(container);
  const containerStyles = window.getComputedStyle(container);
  const gap = parseFloat(containerStyles.gap) || FIRST_INDEX;
  const totalGaps =
    container.children.length > FIRST_INDEX
      ? (container.children.length - SECOND_INDEX) * gap
      : FIRST_INDEX;

  const spaceForButtons = availableWidth - fixedWidth - totalGaps;
  const widthPerLargeButton = calculateLargeButtonWidth(buttons, spaceForButtons);

  return Math.max(MIN_LINK_WIDTH, widthPerLargeButton);
}
