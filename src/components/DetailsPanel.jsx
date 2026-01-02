import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import Panel from './Panel';
import EmptySlotDetails from './EmptySlotDetails';
import ItemPreview from './ItemPreview';
import styles from './DetailsPanel.module.css';

const cx = classNames.bind(styles);

function buildStatsLine(item) {
  return [
    item.type.toUpperCase(),
    item.stats.weight != null ? `${item.stats.weight}kg` : null,
    item.stats.durability != null ? `${item.stats.durability}%` : null,
    item.stackable && item.quantity > 1 ? `×${item.quantity}` : null,
  ].filter(Boolean).join(' · ');
}

export default function DetailsPanel() {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusedEmptySlot = useInventoryStore((state) => state.focusedEmptySlot);
  const items = useInventoryStore((state) => state.items);

  const item = selectedItemId ? items[selectedItemId] : null;

  if (!item && focusedEmptySlot) {
    return <EmptySlotDetails slotId={focusedEmptySlot} />;
  }

  if (!item) {
    return (
      <Panel border="top" className={cx('details-panel')} contentClassName={cx('details-content', 'empty')}>
        <div className={cx('empty-state')}>
          <p className={cx('empty-text')}>Select an item to view details</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel border="top" className={cx('details-panel')} contentClassName={cx('details-content')}>
      <div className={cx('item-preview')}>
        <div className={cx('preview-frame')}>
          <ItemPreview item={item} />
        </div>
      </div>

      <div className={cx('item-info')}>
        <h2 className={cx('item-name')}>{item.name}</h2>
        <p className={cx('item-stats-line')}>{buildStatsLine(item)}</p>
        <p className={cx('item-description')}>{item.description}</p>
      </div>
    </Panel>
  );
}
