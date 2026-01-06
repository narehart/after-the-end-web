import type { Equipment, SlotType } from '../types/inventory';

interface FindEquipmentSlotProps {
  equipment: Equipment;
  itemId: string;
}

export function findEquipmentSlot(props: FindEquipmentSlotProps): SlotType | null {
  const { equipment, itemId } = props;

  const slots: SlotType[] = [
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

  for (const slot of slots) {
    if (equipment[slot] === itemId) {
      return slot;
    }
  }

  return null;
}
