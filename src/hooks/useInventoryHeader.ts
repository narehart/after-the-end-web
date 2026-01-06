import { useState } from 'react';
import { PERCENTAGE_MULTIPLIER } from '../constants/math';

;

interface UseInventoryHeaderProps {
  setPreset: (key: string) => void;
  physicalScale: number;
  setPhysicalScale: (scale: number) => void;
  steamDeckMode: boolean;
  enableSteamDeckMode: () => void;
  disableSteamDeckMode: () => void;
}

interface UseInventoryHeaderReturn {
  showResolutionPicker: boolean;
  steamDeckLabel: string;
  handlePresetSelect: (key: string) => void;
  toggleResolutionPicker: () => void;
  toggleSteamDeck: () => void;
  handleScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function useInventoryHeader({
  setPreset,
  physicalScale,
  setPhysicalScale,
  steamDeckMode,
  enableSteamDeckMode,
  disableSteamDeckMode,
}: UseInventoryHeaderProps): UseInventoryHeaderReturn {
  const [showResolutionPicker, setShowResolutionPicker] = useState(false);

  const handlePresetSelect = (key: string): void => {
    setPreset(key);
    if (key !== 'steam-deck') disableSteamDeckMode();
    setShowResolutionPicker(false);
  };

  const toggleResolutionPicker = (): void => {
    setShowResolutionPicker(!showResolutionPicker);
  };

  const toggleSteamDeck = (): void => {
    steamDeckMode ? disableSteamDeckMode() : enableSteamDeckMode();
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhysicalScale(parseFloat(e.target.value));
  };

  const steamDeckLabel = steamDeckMode
    ? `🎮 ${Math.round(physicalScale * PERCENTAGE_MULTIPLIER)}%`
    : '🎮 1:1';

  return {
    showResolutionPicker,
    steamDeckLabel,
    handlePresetSelect,
    toggleResolutionPicker,
    toggleSteamDeck,
    handleScaleChange,
  };
}
