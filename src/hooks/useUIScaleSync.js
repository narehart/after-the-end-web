import { useEffect } from 'react';

export default function useUIScaleSync(containerRef, physicalScale, setUIScale) {
  useEffect(() => {
    const updateScaleAndRect = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setUIScale(physicalScale, rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null);
      document.documentElement.style.setProperty('--ui-scale', physicalScale);
    };

    updateScaleAndRect();
    window.addEventListener('resize', updateScaleAndRect);
    return () => window.removeEventListener('resize', updateScaleAndRect);
  }, [containerRef, physicalScale, setUIScale]);
}
