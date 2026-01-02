import { useInventoryStore, SLOT_TYPES } from '../stores/inventoryStore';
import Panel from './Panel';
import EquipmentSlot from './EquipmentSlot';
import './EquipmentPanel.css';

export default function EquipmentPanel() {
  const equipment = useInventoryStore((state) => state.equipment);
  const equippedSlots = SLOT_TYPES.filter((slotType) => equipment[slotType] != null);

  return (
    <Panel title="Equipment" border="right" className="equipment-panel">
      <div className="equipment-slots" role="listbox" aria-label="Equipment slots">
        {equippedSlots.map((slotType) => (
          <EquipmentSlot key={slotType} slotType={slotType} />
        ))}
      </div>
    </Panel>
  );
}
