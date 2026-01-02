import classNames from 'classnames/bind';
import { SLOT_LABELS, SLOT_ICONS, SLOT_DESCRIPTIONS } from '../constants/slots';
import type { SlotType } from '../types/inventory';
import Panel from './Panel';
import styles from './EmptySlotDetails.module.css';

const cx = classNames.bind(styles);

interface EmptySlotDetailsProps {
  slotId: SlotType;
}

export default function EmptySlotDetails({ slotId }: EmptySlotDetailsProps): React.JSX.Element {
  return (
    <Panel
      border="top"
      className={cx('details-panel')}
      contentClassName={cx('details-content', 'empty-slot')}
    >
      <div className={cx('item-preview')}>
        <div className={cx('preview-frame', 'empty')}>
          <span className={cx('preview-icon')}>{SLOT_ICONS[slotId]}</span>
        </div>
      </div>
      <div className={cx('item-info')}>
        <h2 className={cx('item-name')}>{SLOT_LABELS[slotId]}</h2>
        <p className={cx('item-type')}>EMPTY SLOT</p>
        <p className={cx('item-description')}>{SLOT_DESCRIPTIONS[slotId]}</p>
      </div>
      <div className={cx('details-hint')}>
        <span>Equip an item to fill this slot</span>
      </div>
    </Panel>
  );
}
