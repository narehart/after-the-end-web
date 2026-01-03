import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
import { DEFAULT_QUANTITY, PERCENTAGE_MULTIPLIER } from '../constants/numbers';
import { getItemIcon } from '../utils/getItemIcon';
import { Flex, Text } from './primitives';
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
    <Flex
      direction="column"
      justify="center"
      align="center"
      className={cx('grid-item', { container: hasGrid })}
      style={{
        width: `${String(item.size.width * PERCENTAGE_MULTIPLIER)}%`,
        height: `${String(item.size.height * PERCENTAGE_MULTIPLIER)}%`,
      }}
    >
      <Text className={cx('item-icon')}>{getItemIcon({ type: item.type })}</Text>
      <Text className={cx('item-name')}>{item.name}</Text>
      {showQuantity ? <Text className={cx('item-quantity')}>x{item.quantity}</Text> : null}
      {hasGrid ? <Text className={cx('container-indicator')}>▼</Text> : null}
    </Flex>
  );
}
