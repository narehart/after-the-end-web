import { useInventoryStore, SLOT_TYPES } from '../stores/inventoryStore';
import EquipmentSlot from './EquipmentSlot';
import './EquipmentPanel.css';

export default function EquipmentPanel() {
  const equipment = useInventoryStore((state) => state.equipment);

  // Only show slots that have items equipped
  const equippedSlots = SLOT_TYPES.filter((slotType) => equipment[slotType] != null);

  return (
    <div className="equipment-panel" role="listbox" aria-label="Equipment slots">
      <h3 className="equipment-title">EQUIPMENT</h3>
      <div className="equipment-slots">
        {equippedSlots.map((slotType) => (
          <EquipmentSlot
            key={slotType}
            slotType={slotType}
          />
        ))}
      </div>
    </div>
  );
}
