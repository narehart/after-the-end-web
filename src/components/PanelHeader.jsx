import { useMemo } from 'react';
import Breadcrumb from './Breadcrumb';
import './PanelHeader.css';

function buildLinks(panelLabel, focusPath, items, onNavigateBack) {
  const links = [{ label: panelLabel }];
  focusPath.forEach((id, index) => {
    const isLast = index === focusPath.length - 1;
    links.push({
      label: items[id]?.name || id,
      onClick: isLast ? undefined : () => onNavigateBack(index),
    });
  });
  return links;
}

export default function PanelHeader({ panelLabel, focusPath, onNavigateBack, items, panelType }) {
  // For world panel at ground level, don't show redundant "ground" breadcrumb
  const isGroundRoot = panelType === 'world' && focusPath.length === 1 && focusPath[0] === 'ground';

  const links = useMemo(() => {
    if (isGroundRoot) {
      return [{ label: panelLabel }];
    }
    return buildLinks(panelLabel, focusPath, items, onNavigateBack);
  }, [panelLabel, focusPath, items, onNavigateBack, isGroundRoot]);

  return <Breadcrumb links={links} />;
}
