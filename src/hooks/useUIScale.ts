import { useState, useEffect, useCallback } from 'react';
import { STEAM_DECK, KNOWN_DISPLAYS, PRESETS } from '../constants/display';

// Estimate diagonal based on resolution patterns when not in known displays
function estimateDiagonal(physicalWidth: number, physicalHeight: number, dpr: number): number {
  const isHiDpi = dpr > 1;
  // Resolution thresholds for common monitor sizes
  if (physicalWidth <= 1920 && physicalHeight <= 1080) return isHiDpi ? 14 : 24;
  if (physicalWidth <= 2560 && physicalHeight <= 1600) return 14;
  if (physicalWidth <= 2560 && physicalHeight <= 1440) return isHiDpi ? 15.6 : 27;
  if (physicalWidth <= 3840) return 27;
  return 24;
}

// Get monitor diagonal - use known display database or fall back to estimation
function getMonitorDiagonal(): number {
  const dpr = window.devicePixelRatio;
  const physicalWidth = window.screen.width * dpr;
  const physicalHeight = window.screen.height * dpr;
  const key = `${String(physicalWidth)}x${String(physicalHeight)}`;

  return KNOWN_DISPLAYS[key] ?? estimateDiagonal(physicalWidth, physicalHeight, dpr);
}

// Calculate scale needed to show Steam Deck at true physical size
function calculateSteamDeckScale(): number {
  const dpr = window.devicePixelRatio;
  const monitorDiagonalInches = getMonitorDiagonal();

  // Physical pixel resolution
  const screenWidthPx = window.screen.width * dpr;
  const screenHeightPx = window.screen.height * dpr;

  // Calculate PPI from diagonal
  const screenDiagonalPx = Math.sqrt(screenWidthPx ** 2 + screenHeightPx ** 2);
  const actualPPI = screenDiagonalPx / monitorDiagonalInches;

  // How many physical pixels = Steam Deck's physical width?
  const targetPhysicalPx = STEAM_DECK.physicalWidthInches * actualPPI;

  // CSS transform scale: we need (1280 * scale * dpr) physical pixels = targetPhysicalPx
  const scale = targetPhysicalPx / (STEAM_DECK.width * dpr);

  return Math.min(1, Math.max(0.25, scale));
}

interface Resolution {
  width: number;
  height: number;
}

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
    width: steamDeckPreset?.width ?? 1280,
    height: steamDeckPreset?.height ?? 800,
  });
  const [effectiveResolution, setEffectiveResolution] = useState<Resolution>({
    width: 1280,
    height: 800,
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
    setPhysicalScaleState(1.0);
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
