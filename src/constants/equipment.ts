import type { Equipment, EquipmentSlot } from '../types/equipment';

export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  'helmet',
  'eyes',
  'face',
  'neck',
  'backpack',
  'coat',
  'vest',
  'shirt',
  'rightShoulder',
  'leftShoulder',
  'rightGlove',
  'leftGlove',
  'rightRing',
  'leftRing',
  'rightHolding',
  'leftHolding',
  'pouch',
  'pants',
  'rightShoe',
  'leftShoe',
];

export const EQUIPMENT_LABELS: Record<EquipmentSlot, string> = {
  helmet: 'Helmet',
  eyes: 'Eyes',
  face: 'Face',
  neck: 'Neck',
  backpack: 'Backpack',
  coat: 'Coat',
  vest: 'Vest',
  shirt: 'Shirt',
  rightShoulder: 'R. Shoulder',
  leftShoulder: 'L. Shoulder',
  rightGlove: 'R. Glove',
  leftGlove: 'L. Glove',
  rightRing: 'R. Ring',
  leftRing: 'L. Ring',
  rightHolding: 'R. Hand',
  leftHolding: 'L. Hand',
  pouch: 'Pouch',
  pants: 'Pants',
  rightShoe: 'R. Shoe',
  leftShoe: 'L. Shoe',
};

// Using neoItems IDs for initial equipment
export const INITIAL_EQUIPMENT: Equipment = {
  helmet: null,
  eyes: 'neo_57', // night vision goggles
  face: null,
  neck: null,
  backpack: 'neo_42', // bag with 10x10 grid
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
  pouch: 'neo_1', // bag with 4x6 grid
  pants: null,
  rightShoe: 'neo_5', // clothes (shoes)
  leftShoe: 'neo_6', // clothes (shoes)
};
