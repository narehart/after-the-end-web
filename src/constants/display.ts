import type { ResolutionPreset } from '../types/ui';

export const STEAM_DECK = {
  width: 1280,
  height: 800,
  diagonalInches: 7.4,
  physicalWidthInches: 6.275,
  physicalHeightInches: 3.922,
};

export const KNOWN_DISPLAYS: Record<string, number> = {
  '3024x1964': 14.2, // MacBook Pro 14"
  '3456x2234': 16.2, // MacBook Pro 16"
  '2560x1600': 13.3, // MacBook Air 13"
  '2880x1800': 15.4, // MacBook Pro 15" (older)
  '2560x1664': 13.6, // MacBook Air 15"
  '3024x1890': 14.2, // MacBook Pro 14" (alternate)
};

export const PRESETS: Record<string, ResolutionPreset> = {
  'steam-deck': { width: 1280, height: 800, label: 'Steam Deck (1280×800)', physicalMode: true },
  'laptop-hd': { width: 1366, height: 768, label: 'Laptop HD (1366×768)' },
  'laptop-fhd': { width: 1920, height: 1080, label: 'Laptop FHD (1920×1080)' },
  'desktop-2k': { width: 2560, height: 1440, label: 'Desktop 2K (2560×1440)' },
  native: { width: null, height: null, label: 'Native Resolution' },
};

// Resolution thresholds for display detection
export const RESOLUTION_FHD_WIDTH = 1920;
export const RESOLUTION_FHD_HEIGHT = 1080;
export const RESOLUTION_WQXGA_WIDTH = 2560;
export const RESOLUTION_WQXGA_HEIGHT = 1600;
export const RESOLUTION_QHD_HEIGHT = 1440;
export const RESOLUTION_4K_WIDTH = 3840;

// Display diagonal sizes (inches)
export const DIAGONAL_LAPTOP_SMALL = 14;
export const DIAGONAL_LAPTOP_MEDIUM = 15.6;
export const DIAGONAL_DESKTOP_SMALL = 24;
export const DIAGONAL_DESKTOP_LARGE = 27;

// Reference resolution for scaling
export const REFERENCE_WIDTH = 1280;
export const REFERENCE_HEIGHT = 800;
