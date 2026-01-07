import type { MenuState } from '../types/inventory';
import type { ScreenTab } from '../types/ui';

// Menu constants
export const INITIAL_MENU: MenuState = {
  isOpen: false,
  position: null,
  targetItemId: null,
  targetEquipmentSlot: null,
  itemId: null,
  source: null,
  path: [],
  focusIndex: 0,
};

// Breadcrumb constants
export const MIN_LINK_WIDTH = 40;
export const MIN_BREADCRUMB_LINKS = 2;

// Grid constants
export const GRID_COLUMNS = 10;
export const CELL_GAP = 2;
export const GRID_BORDER = 4;
export const CONTENT_PADDING = 16;
export const MIN_CELL_SIZE = 24;
export const DEFAULT_CELL_SIZE = 32;
export const MIN_SCALE = 0.25;
export const DEFAULT_SCALE = 1;

// Display constants
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

export const PRESETS: Record<
  string,
  { width: number | null; height: number | null; label: string; physicalMode?: boolean }
> = {
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

// Viewport dimensions (minimum inner window size)
export const VIEWPORT_WIDTH = 1280;
export const VIEWPORT_HEIGHT = 720;

/* eslint-disable @typescript-eslint/no-magic-numbers */
// Aspect ratios (width / height) - used by KNOWN_ASPECT_RATIOS
const ASPECT_RATIO_16_10 = 16 / 10;
const ASPECT_RATIO_16_9 = 16 / 9;
const ASPECT_RATIO_21_9 = 21 / 9;
const ASPECT_RATIO_32_9 = 32 / 9;
const ASPECT_RATIO_3_2 = 3 / 2;
const ASPECT_RATIO_4_3 = 4 / 3;
const ASPECT_RATIO_5_4 = 5 / 4;
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const ASPECT_RATIO_TOLERANCE = 0.02;
export const ASPECT_RATIO_LABEL_PRECISION = 2;

export const KNOWN_ASPECT_RATIOS: ReadonlyArray<{ ratio: number; label: string }> = [
  { ratio: ASPECT_RATIO_16_10, label: '16:10' },
  { ratio: ASPECT_RATIO_16_9, label: '16:9' },
  { ratio: ASPECT_RATIO_21_9, label: '21:9' },
  { ratio: ASPECT_RATIO_32_9, label: '32:9' },
  { ratio: ASPECT_RATIO_3_2, label: '3:2' },
  { ratio: ASPECT_RATIO_4_3, label: '4:3' },
  { ratio: ASPECT_RATIO_5_4, label: '5:4' },
];

// Main menu screen tabs
export const SCREEN_TABS: readonly ScreenTab[] = [
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'character', label: 'Character', icon: '👤' },
  { id: 'status', label: 'Status', icon: '❤️' },
  { id: 'camping', label: 'Camping', icon: '🏕️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];
