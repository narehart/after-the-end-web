import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import ConditionBar from './ConditionBar';
import styles from './CharacterPanel.module.css';

const cx = classNames.bind(styles);

export default function CharacterPanel() {
  const conditions = useInventoryStore((state) => state.conditions);

  return (
    <div className={cx('character-panel')}>
      <div className={cx('character-model')}>
        <div className={cx('character-silhouette')}>
          <span className={cx('character-icon')}>🧍</span>
        </div>
      </div>

      <div className={cx('condition-stats')}>
        <h3 className={cx('stats-title')}>STATUS</h3>
        <ConditionBar label="HEALTH" value={conditions.health} color="#8b4513" />
        <ConditionBar label="HUNGER" value={conditions.hunger} color="#654321" />
        <ConditionBar label="THIRST" value={conditions.thirst} color="#4a6741" />
        <ConditionBar label="TEMP" value={conditions.temperature} color="#5c5c5c" />
        <ConditionBar label="ENCUM" value={conditions.encumbrance} color="#3d3d3d" />
      </div>
    </div>
  );
}
