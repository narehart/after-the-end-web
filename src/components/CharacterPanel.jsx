import { useInventoryStore } from '../stores/inventoryStore';
import ConditionBar from './ConditionBar';
import './CharacterPanel.css';

export default function CharacterPanel() {
  const conditions = useInventoryStore((state) => state.conditions);

  return (
    <div className="character-panel">
      <div className="character-model">
        <div className="character-silhouette">
          <span className="character-icon">🧍</span>
        </div>
      </div>

      <div className="condition-stats">
        <h3 className="stats-title">STATUS</h3>
        <ConditionBar label="HEALTH" value={conditions.health} color="#8b4513" />
        <ConditionBar label="HUNGER" value={conditions.hunger} color="#654321" />
        <ConditionBar label="THIRST" value={conditions.thirst} color="#4a6741" />
        <ConditionBar label="TEMP" value={conditions.temperature} color="#5c5c5c" />
        <ConditionBar label="ENCUM" value={conditions.encumbrance} color="#3d3d3d" />
      </div>
    </div>
  );
}
