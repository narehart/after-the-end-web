import { STEAM_DECK } from '../constants/display';
import { HALVE_DIVISOR } from '../constants/math';
import { DEFAULT_SCALE, MIN_SCALE } from '../constants/grid';
import { getMonitorDiagonal } from './getMonitorDiagonal';

;

export function calculateSteamDeckScale(): number {
  const dpr = window.devicePixelRatio;
  const monitorDiagonalInches = getMonitorDiagonal();

  // Physical pixel resolution
  const screenWidthPx = window.screen.width * dpr;
  const screenHeightPx = window.screen.height * dpr;

  // Calculate PPI from diagonal
  const screenDiagonalPx = Math.sqrt(
    screenWidthPx ** HALVE_DIVISOR + screenHeightPx ** HALVE_DIVISOR
  );
  const actualPPI = screenDiagonalPx / monitorDiagonalInches;

  // How many physical pixels = Steam Deck's physical width?
  const targetPhysicalPx = STEAM_DECK.physicalWidthInches * actualPPI;

  // CSS transform scale: we need (1280 * scale * dpr) physical pixels = targetPhysicalPx
  const scale = targetPhysicalPx / (STEAM_DECK.width * dpr);

  return Math.min(DEFAULT_SCALE, Math.max(MIN_SCALE, scale));
}
