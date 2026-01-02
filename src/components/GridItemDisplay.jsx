import classNames from 'classnames/bind';
import styles from './GridItemDisplay.module.css';

const cx = classNames.bind(styles);

function getItemIcon(type) {
  const icons = {
    container: '📦',
    consumable: '💊',
    weapon: '🗡',
    clothing: '👔',
    ammo: '🔸',
    tool: '🔦',
    accessory: '🔹',
  };
  return icons[type] || '◻';
}

export default function GridItemDisplay({ item, hasGrid }) {
  return (
    <div
      className={cx('grid-item', { container: hasGrid })}
      style={{
        width: `${item.size.width * 100}%`,
        height: `${item.size.height * 100}%`,
      }}
    >
      <span className={cx('item-icon')}>{getItemIcon(item.type)}</span>
      <span className={cx('item-name')}>{item.name}</span>
      {item.stackable && item.quantity > 1 && (
        <span className={cx('item-quantity')}>x{item.quantity}</span>
      )}
      {hasGrid && <span className={cx('container-indicator')}>▼</span>}
    </div>
  );
}
