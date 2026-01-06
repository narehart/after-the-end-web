import { useInventoryStore, EQUIPMENT_SLOTS } from '../stores/inventoryStore';
import { FIRST_INDEX } from '../constants/primitives';
import EquipmentSlot from './EquipmentSlot';
import { List, Panel } from '.';

export default function EquipmentPanel(): React.JSX.Element {
  const equipment = useInventoryStore((state) => state.equipment);
  const equippedSlots = EQUIPMENT_SLOTS.filter((slotType) => equipment[slotType] != null);

  const hasEquipment = equippedSlots.length > FIRST_INDEX;

  return (
    <Panel title="Equipment" border="right" emptyMessage="No items equipped">
      {hasEquipment ? (
        <List
          dataSource={equippedSlots}
          renderItem={(slotType): React.JSX.Element => <EquipmentSlot slotType={slotType} />}
          role="listbox"
        />
      ) : null}
    </Panel>
  );
}
