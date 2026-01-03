import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
import { DEFAULT_QUANTITY, PERCENTAGE_MULTIPLIER } from '../constants/numbers';
import { getItemIcon } from '../utils/getItemIcon';
import styles from './GridItemDisplay.module.css';

const cx = classNames.bind(styles);

interface GridItemDisplayProps {
  item: Item;
  hasGrid: boolean;
}

export default function GridItemDisplay({
  item,
  hasGrid,
}: GridItemDisplayProps): React.JSX.Element {
  const showQuantity = item.quantity !== undefined && item.quantity > DEFAULT_QUANTITY;

  return (
    <div
      className={cx('grid-item', { container: hasGrid })}
      style={{
        width: `${String(item.size.width * PERCENTAGE_MULTIPLIER)}%`,
        height: `${String(item.size.height * PERCENTAGE_MULTIPLIER)}%`,
      }}
    >
      <span className={cx('item-icon')}>{getItemIcon({ type: item.type })}</span>
      <span className={cx('item-name')}>{item.name}</span>
      {showQuantity ? <span className={cx('item-quantity')}>x{item.quantity}</span> : null}
      {hasGrid ? <span className={cx('container-indicator')}>▼</span> : null}
    </div>
  );
}
