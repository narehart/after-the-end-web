import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';
import getButtonNaturalWidth from './getButtonNaturalWidth';

export default function calculateLargeButtonWidth(
  buttons: NodeListOf<Element>,
  spaceForButtons: number
): number {
  const fairShare = Math.floor(spaceForButtons / buttons.length);
  let spaceUsedBySmall = FIRST_INDEX;
  let largeButtonCount = FIRST_INDEX;

  Array.from(buttons).forEach((btn) => {
    const naturalWidth = getButtonNaturalWidth(btn);
    if (naturalWidth <= fairShare) {
      spaceUsedBySmall += naturalWidth;
    } else {
      largeButtonCount += SECOND_INDEX;
    }
  });

  const spaceForLarge = spaceForButtons - spaceUsedBySmall;
  return largeButtonCount > FIRST_INDEX ? Math.floor(spaceForLarge / largeButtonCount) : fairShare;
}
