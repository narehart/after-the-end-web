import { STEAM_DECK } from '../constants/display';
import { getMonitorDiagonal } from './getMonitorDiagonal';

export function calculateSteamDeckScale(): number {
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
