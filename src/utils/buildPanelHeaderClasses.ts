import type { PanelHeaderTypeReturn } from '../types/ui';

export default function buildPanelHeaderClasses(
  cx: (...args: Array<string | Record<string, boolean>>) => string,
  headerType: PanelHeaderTypeReturn
): string {
  const isStyled = headerType === 'title' || headerType === 'breadcrumb';
  return cx('panel-header', { 'panel-header--styled': isStyled });
}
