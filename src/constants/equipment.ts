import type { Equipment } from '../types/inventory';

// All slots start empty - equip functionality disabled until equippableSlots added to neoItems
export const INITIAL_EQUIPMENT: Equipment = {
  helmet: null,
  eyes: null,
  face: null,
  neck: null,
  backpack: null,
  coat: null,
  vest: null,
  shirt: null,
  rightShoulder: null,
  leftShoulder: null,
  rightGlove: null,
  leftGlove: null,
  rightRing: null,
  leftRing: null,
  rightHolding: null,
  leftHolding: null,
  pouch: null,
  pants: null,
  rightShoe: null,
  leftShoe: null,
};
