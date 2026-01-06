import type { BorderPosition } from '../types/ui';

export default function buildPanelClasses(
  cx: (...args: Array<string | Record<string, boolean>>) => string,
  border: BorderPosition | undefined,
  className: string | undefined
): string {
  const panelClasses = cx('panel', {
    'panel--border-right': border === 'right',
    'panel--border-left': border === 'left',
    'panel--border-top': border === 'top',
    'panel--border-bottom': border === 'bottom',
  });

  return className !== undefined ? `${panelClasses} ${className}` : panelClasses;
}
