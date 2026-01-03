import classNames from 'classnames/bind';
import { PERCENTAGE_MULTIPLIER } from '../../constants/numbers';
import styles from './ConditionBar.module.css';
import { Box, Flex, Text } from './index';

const cx = classNames.bind(styles);

interface ConditionBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
}

export default function ConditionBar({
  label,
  value,
  max = PERCENTAGE_MULTIPLIER,
  color,
}: ConditionBarProps): React.JSX.Element {
  const percentage = (value / max) * PERCENTAGE_MULTIPLIER;
  return (
    <Flex align="center" gap="8" className={cx('condition-bar')}>
      <Text className={cx('condition-label')}>{label}</Text>
      <Box className={cx('condition-track')}>
        <Box
          className={cx('condition-fill')}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </Box>
      <Text className={cx('condition-value')}>{value}</Text>
    </Flex>
  );
}
