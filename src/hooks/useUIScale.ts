import { useState, useEffect, useCallback } from 'react';
import { PRESETS, REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../constants/display';
import { DEFAULT_SCALE } from '../constants/numbers';
import type { Resolution } from '../types/ui';
import { calculateSteamDeckScale } from '../utils/calculateSteamDeckScale';

interface UseUIScaleReturn {
  effectiveResolution: Resolution;
  simulatedResolution: Resolution | null;
  setSimulatedResolution: (resolution: Resolution | null) => void;
  setPreset: (presetKey: string) => void;
  isSimulated: boolean;
  physicalScale: number;
  setPhysicalScale: (scale: number) => void;
  steamDeckMode: boolean;
  enableSteamDeckMode: () => void;
  disableSteamDeckMode: () => void;
}

export function useUIScale(): UseUIScaleReturn {
  const steamDeckPreset = PRESETS['steam-deck'];
  const [simulatedResolution, setSimulatedResolution] = useState<Resolution | null>({
    width: steamDeckPreset?.width ?? REFERENCE_WIDTH,
    height: steamDeckPreset?.height ?? REFERENCE_HEIGHT,
  });
  const [effectiveResolution, setEffectiveResolution] = useState<Resolution>({
    width: REFERENCE_WIDTH,
    height: REFERENCE_HEIGHT,
  });
  const [steamDeckMode, setSteamDeckMode] = useState(true);

  // Calculate scale automatically from known display database
  const [physicalScale, setPhysicalScaleState] = useState((): number => calculateSteamDeckScale());

  // When user adjusts scale, save it as their calibrated value
  const setPhysicalScale = useCallback((scale: number): void => {
    setPhysicalScaleState(scale);
    localStorage.setItem('steamDeckCalibratedScale', String(scale));
  }, []);

  // Enable Steam Deck physical scaling
  const enableSteamDeckMode = useCallback((): void => {
    setPhysicalScaleState(calculateSteamDeckScale());
    setSteamDeckMode(true);
  }, []);

  // Disable physical scaling
  const disableSteamDeckMode = useCallback((): void => {
    setPhysicalScaleState(DEFAULT_SCALE);
    setSteamDeckMode(false);
  }, []);

  const calculateResolution = useCallback((): void => {
    if (simulatedResolution !== null) {
      setEffectiveResolution({
        width: simulatedResolution.width,
        height: simulatedResolution.height,
      });
    } else {
      setEffectiveResolution({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [simulatedResolution]);

  useEffect(() => {
    calculateResolution();
    window.addEventListener('resize', calculateResolution);
    return (): void => {
      window.removeEventListener('resize', calculateResolution);
    };
  }, [calculateResolution]);

  const setPreset = useCallback((presetKey: string): void => {
    const preset = PRESETS[presetKey];
    if (preset?.width !== null && preset?.width !== undefined && preset.height !== null) {
      setSimulatedResolution({ width: preset.width, height: preset.height });
    } else {
      setSimulatedResolution(null);
    }
  }, []);

  return {
    effectiveResolution,
    simulatedResolution,
    setSimulatedResolution,
    setPreset,
    isSimulated: simulatedResolution !== null,
    physicalScale,
    setPhysicalScale,
    steamDeckMode,
    enableSteamDeckMode,
    disableSteamDeckMode,
  };
}
