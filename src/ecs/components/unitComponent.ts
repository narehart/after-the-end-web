/**
 * Unit Component
 *
 * Unit data (for characters, enemies, NPCs)
 */

export interface UnitComponent {
  unitType: string;
  faction: string;
  actionPoints: number;
  maxActionPoints: number;
}
