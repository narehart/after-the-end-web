import classNames from 'classnames/bind';
import { useInventoryStore, SLOT_TYPES } from '../stores/inventoryStore';
import { FIRST_INDEX } from '../constants/numbers';
import { List, Panel } from './primitives';
import EquipmentSlot from './EquipmentSlot';
import styles from './EquipmentPanel.module.css';

const cx = classNames.bind(styles);

export default function EquipmentPanel(): React.JSX.Element {
  const equipment = useInventoryStore((state) => state.equipment);
  const equippedSlots = SLOT_TYPES.filter((slotType) => equipment[slotType] != null);

  const hasEquipment = equippedSlots.length > FIRST_INDEX;

  return (
    <Panel
      title="Equipment"
      border="right"
      className={cx('equipment-panel')}
      emptyMessage="No items equipped"
    >
      {hasEquipment ? (
        <List
          dataSource={equippedSlots}
          renderItem={(slotType): React.JSX.Element => <EquipmentSlot slotType={slotType} />}
          role="listbox"
          className={cx('equipment-slots')}
        />
      ) : null}
    </Panel>
  );
}
