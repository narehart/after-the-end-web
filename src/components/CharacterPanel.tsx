import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import ConditionBar from './ConditionBar';
import { Box, Text } from './primitives';
import styles from './CharacterPanel.module.css';

const cx = classNames.bind(styles);

export default function CharacterPanel(): React.JSX.Element {
  const conditions = useInventoryStore((state) => state.conditions);

  return (
    <Box className={cx('character-panel')}>
      <Box className={cx('character-model')}>
        <Box className={cx('character-silhouette')}>
          <Text className={cx('character-icon')}>🧍</Text>
        </Box>
      </Box>

      <Box className={cx('condition-stats')}>
        <Text as="h3" className={cx('stats-title')}>
          STATUS
        </Text>
        <ConditionBar label="HEALTH" value={conditions.health} color="#8b4513" />
        <ConditionBar label="HUNGER" value={conditions.hunger} color="#654321" />
        <ConditionBar label="THIRST" value={conditions.thirst} color="#4a6741" />
        <ConditionBar label="TEMP" value={conditions.temperature} color="#5c5c5c" />
        <ConditionBar label="ENCUM" value={conditions.encumbrance} color="#3d3d3d" />
      </Box>
    </Box>
  );
}
