import { useEffect } from 'react';

export default function useUIScaleSync(containerRef, physicalScale, setUIScale) {
  useEffect(() => {
    const updateScaleAndRect = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setUIScale(physicalScale, rect ? { left: rect.left, top: rect.top } : null);
    };

    updateScaleAndRect();
    window.addEventListener('resize', updateScaleAndRect);
    return () => window.removeEventListener('resize', updateScaleAndRect);
  }, [containerRef, physicalScale, setUIScale]);
}
