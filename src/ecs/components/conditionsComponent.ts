/**
 * Conditions Component
 *
 * Character conditions (health, hunger, thirst, etc.)
 */

export interface ConditionsComponent {
  health: number;
  maxHealth: number;
  hunger: number;
  maxHunger: number;
  thirst: number;
  maxThirst: number;
  temperature: number;
  encumbrance: number;
  maxEncumbrance: number;
}
