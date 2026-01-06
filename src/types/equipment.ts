export type EquipmentSlot =
  | 'helmet'
  | 'eyes'
  | 'face'
  | 'neck'
  | 'backpack'
  | 'coat'
  | 'vest'
  | 'shirt'
  | 'rightShoulder'
  | 'leftShoulder'
  | 'rightGlove'
  | 'leftGlove'
  | 'rightRing'
  | 'leftRing'
  | 'rightHolding'
  | 'leftHolding'
  | 'pouch'
  | 'pants'
  | 'rightShoe'
  | 'leftShoe';

export type Equipment = Record<EquipmentSlot, string | null>;
