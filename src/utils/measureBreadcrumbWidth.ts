import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import { MIN_LINK_WIDTH } from '../constants/breadcrumb';

export default function measureBreadcrumbWidth(container: HTMLElement): number | null {
  const parent = container.parentElement;
  if (parent === null) return null;

  const parentStyles = window.getComputedStyle(parent);
  const paddingLeft = parseFloat(parentStyles.paddingLeft);
  const paddingRight = parseFloat(parentStyles.paddingRight);
  const availableWidth = parent.clientWidth - paddingLeft - paddingRight;

  if (availableWidth <= FIRST_INDEX) return null;

  const buttons = container.querySelectorAll('button');
  if (buttons.length <= FIRST_INDEX) return null;

  const allChildren = container.children;
  let fixedWidth = FIRST_INDEX;

  Array.from(allChildren).forEach((child) => {
    if (child.querySelector('button') === null) {
      fixedWidth += child.getBoundingClientRect().width;
    }
    const separator = child.querySelector('span:not([class*="text--ellipsis"])');
    if (separator !== null && separator.textContent === '›') {
      fixedWidth += separator.getBoundingClientRect().width;
    }
  });

  const containerStyles = window.getComputedStyle(container);
  const gap = parseFloat(containerStyles.gap) || FIRST_INDEX;
  const childCount = allChildren.length;
  const totalGaps = childCount > FIRST_INDEX ? (childCount - SECOND_INDEX) * gap : FIRST_INDEX;

  const widthForButtons = availableWidth - fixedWidth - totalGaps;
  const widthPerButton = Math.floor(widthForButtons / buttons.length);

  return Math.max(MIN_LINK_WIDTH, widthPerButton);
}
