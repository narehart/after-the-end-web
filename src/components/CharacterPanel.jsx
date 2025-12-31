import { useInventoryStore } from '../stores/inventoryStore';
import './CharacterPanel.css';

function ConditionBar({ label, value, max = 100, color }) {
  const percentage = (value / max) * 100;
  return (
    <div className="condition-bar">
      <span className="condition-label">{label}</span>
      <div className="condition-track">
        <div
          className="condition-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="condition-value">{value}</span>
    </div>
  );
}

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
