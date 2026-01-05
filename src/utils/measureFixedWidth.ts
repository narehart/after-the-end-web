import { FIRST_INDEX } from '../constants/numbers';

export default function measureFixedWidth(container: HTMLElement): number {
  let fixedWidth = FIRST_INDEX;
  Array.from(container.children).forEach((child) => {
    if (child.querySelector('button') === null) {
      fixedWidth += child.getBoundingClientRect().width;
    }
    const separator = child.querySelector('span:not([class*="text--ellipsis"])');
    if (separator !== null && separator.textContent === '›') {
      fixedWidth += separator.getBoundingClientRect().width;
    }
  });
  return fixedWidth;
}
