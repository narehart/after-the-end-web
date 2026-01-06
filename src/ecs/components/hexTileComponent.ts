/**
 * Hex Tile Component
 *
 * Hex tile data
 */

export interface HexTileComponent {
  terrain: string;
  passable: boolean;
  visibility: 'hidden' | 'explored' | 'visible';
}
