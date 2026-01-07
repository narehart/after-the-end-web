import { useState, useEffect, useCallback } from 'react';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../constants/ui';
import { useInventoryStore } from '../stores/inventoryStore';
import { calculateViewportScale } from '../utils/calculateViewportScale';
import type { ViewportMode } from '../types/settings';
import type { CSSPropertiesWithVars } from '../types/ui';

interface UseViewportScaleReturn {
  scale: number;
  containerStyle: CSSPropertiesWithVars;
  viewportMode: ViewportMode;
}

export function useViewportScale(): UseViewportScaleReturn {
  const viewportMode = useInventoryStore((s) => s.settingsViewportMode);
  const uiScale = useInventoryStore((s) => s.settingsUiScale);

  const [scale, setScale] = useState(() => calculateViewportScale({ viewportMode, uiScale }));

  const updateScale = useCallback((): void => {
    setScale(calculateViewportScale({ viewportMode, uiScale }));
  }, [viewportMode, uiScale]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return (): void => {
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  const containerStyle: CSSPropertiesWithVars = {
    width: `${REFERENCE_WIDTH}px`,
    height: `${REFERENCE_HEIGHT}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center',
  };

  return {
    scale,
    containerStyle,
    viewportMode,
  };
}
