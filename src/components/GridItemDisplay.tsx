import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
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
  return (
    <div
      className={cx('grid-item', { container: hasGrid })}
      style={{
        width: `${String(item.size.width * 100)}%`,
        height: `${String(item.size.height * 100)}%`,
      }}
    >
      <span className={cx('item-icon')}>{getItemIcon(item.type)}</span>
      <span className={cx('item-name')}>{item.name}</span>
      {item.stackable && item.quantity > 1 ? (
        <span className={cx('item-quantity')}>x{item.quantity}</span>
      ) : null}
      {hasGrid ? <span className={cx('container-indicator')}>▼</span> : null}
    </div>
  );
}
