import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { buildStatsLine } from '../utils/buildStatsLine';
import Panel from './Panel';
import EmptySlotDetails from './EmptySlotDetails';
import ItemPreview from './ItemPreview';
import styles from './DetailsPanel.module.css';

const cx = classNames.bind(styles);

export default function DetailsPanel(): React.JSX.Element {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusedEmptySlot = useInventoryStore((state) => state.focusedEmptySlot);
  const items = useInventoryStore((state) => state.items);

  const item = selectedItemId !== null ? (items[selectedItemId] ?? null) : null;

  if (item === null && focusedEmptySlot !== null) {
    return <EmptySlotDetails slotId={focusedEmptySlot} />;
  }

  if (item === null) {
    return (
      <Panel
        border="top"
        className={cx('details-panel')}
        contentClassName={cx('details-content', 'empty')}
      >
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
          <ItemPreview
            item={item}
            imageClassName={cx('preview-image')}
            iconClassName={cx('preview-icon')}
          />
        </div>
      </div>

      <div className={cx('item-info')}>
        <h2 className={cx('item-name')}>{item.description}</h2>
        <p className={cx('item-stats-line')}>{buildStatsLine({ item })}</p>
        <p className={cx('item-flavor-text')}>
          {item.flavorText ?? `A scavenged ${item.type} from the Florida wasteland.`}
        </p>
      </div>
    </Panel>
  );
}
