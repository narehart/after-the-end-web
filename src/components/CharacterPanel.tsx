import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { ConditionBar, Flex, Text } from './primitives';
import styles from './CharacterPanel.module.css';

const cx = classNames.bind(styles);

export default function CharacterPanel(): React.JSX.Element {
  const conditions = useInventoryStore((state) => state.conditions);

  return (
    <Flex direction="column" className={cx('character-panel')}>
      <Flex justify="center" align="center" className={cx('character-model')}>
        <Flex justify="center" align="center" className={cx('character-silhouette')}>
          <Text className={cx('character-icon')}>🧍</Text>
        </Flex>
      </Flex>

      <Flex direction="column" gap="6" className={cx('condition-stats')}>
        <Text as="h3" className={cx('stats-title')}>
          STATUS
        </Text>
        <ConditionBar label="HEALTH" value={conditions.health} color="#8b4513" />
        <ConditionBar label="HUNGER" value={conditions.hunger} color="#654321" />
        <ConditionBar label="THIRST" value={conditions.thirst} color="#4a6741" />
        <ConditionBar label="TEMP" value={conditions.temperature} color="#5c5c5c" />
        <ConditionBar label="ENCUM" value={conditions.encumbrance} color="#3d3d3d" />
      </Flex>
    </Flex>
  );
}
