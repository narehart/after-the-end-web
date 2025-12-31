import { useInventoryStore, SLOT_LABELS } from '../stores/inventoryStore';
import './DetailsPanel.css';

// Slot icons for empty state
const SLOT_ICONS = {
  helmet: '⛑',
  eyes: '👓',
  face: '😷',
  neck: '🧣',
  backpack: '🎒',
  coat: '🧥',
  vest: '🦺',
  shirt: '👕',
  rightShoulder: '⬛',
  leftShoulder: '⬛',
  rightGlove: '🧤',
  leftGlove: '🧤',
  rightRing: '💍',
  leftRing: '💍',
  rightHolding: '✋',
  leftHolding: '✋',
  pouch: '👝',
  pants: '👖',
  rightShoe: '👟',
  leftShoe: '👟',
};

// Descriptions for empty slots
const SLOT_DESCRIPTIONS = {
  helmet: 'Protects your head from impacts and environmental hazards.',
  eyes: 'Shields your eyes from debris, bright light, or harmful particles.',
  face: 'Covers your face for protection or filtering air.',
  neck: 'Provides warmth or protection for your neck area.',
  backpack: 'Your main storage for carrying items and supplies.',
  coat: 'Outer layer providing warmth and weather protection.',
  vest: 'Tactical or protective vest worn over clothing.',
  shirt: 'Base layer clothing for your torso.',
  rightShoulder: 'Attachment point for shoulder-mounted gear.',
  leftShoulder: 'Attachment point for shoulder-mounted gear.',
  rightGlove: 'Protects your right hand and improves grip.',
  leftGlove: 'Protects your left hand and improves grip.',
  rightRing: 'Accessory slot for your right hand.',
  leftRing: 'Accessory slot for your left hand.',
  rightHolding: 'What you hold in your right hand.',
  leftHolding: 'What you hold in your left hand.',
  pouch: 'Small container for quick-access items.',
  pants: 'Lower body clothing with potential pocket storage.',
  rightShoe: 'Footwear for your right foot.',
  leftShoe: 'Footwear for your left foot.',
};

function StatRow({ label, value, unit = '' }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}{unit}
      </span>
    </div>
  );
}

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

function getStatLabel(key) {
  const labels = {
    weight: 'Weight',
    durability: 'Durability',
    damage: 'Damage',
    protection: 'Protection',
    warmth: 'Warmth',
    healing: 'Healing',
    hydration: 'Hydration',
    nutrition: 'Nutrition',
    battery: 'Battery',
  };
  return labels[key] || key;
}

function getStatUnit(key) {
  const units = {
    weight: ' kg',
    durability: '%',
    damage: '',
    protection: '',
    warmth: '',
    healing: ' HP',
    hydration: '%',
    nutrition: '%',
    battery: '%',
  };
  return units[key] || '';
}

export default function DetailsPanel() {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusedEmptySlot = useInventoryStore((state) => state.focusedEmptySlot);
  const items = useInventoryStore((state) => state.items);

  const item = selectedItemId ? items[selectedItemId] : null;

  // Show empty slot info when hovering over empty equipment slot
  if (!item && focusedEmptySlot) {
    return (
      <div className="details-panel empty-slot">
        <div className="item-preview">
          <div className="preview-frame empty">
            <span className="preview-icon">{SLOT_ICONS[focusedEmptySlot] || '◻'}</span>
          </div>
        </div>
        <div className="item-info">
          <h2 className="item-name">{SLOT_LABELS[focusedEmptySlot]}</h2>
          <p className="item-type">EMPTY SLOT</p>
          <p className="item-description">{SLOT_DESCRIPTIONS[focusedEmptySlot]}</p>
        </div>
        <div className="details-hint">
          <span>Equip an item to fill this slot</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="details-panel empty">
        <div className="empty-state">
          <span className="empty-icon">👆</span>
          <p className="empty-text">Select an item to view details</p>
        </div>
      </div>
    );
  }

  // Build compact stats line
  const statsLine = [
    item.type.toUpperCase(),
    item.stats.weight != null ? `${item.stats.weight}kg` : null,
    item.stats.durability != null ? `${item.stats.durability}%` : null,
    item.stackable && item.quantity > 1 ? `×${item.quantity}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="details-panel">
      <div className="item-preview">
        <div className="preview-frame">
          {item.image ? (
            <img
              src={`/src/assets/items/${item.image}`}
              alt={item.name}
              className="preview-image"
              draggable={false}
            />
          ) : (
            <span
              className="preview-icon"
              style={{ transform: `rotate(${item.rotation}deg)` }}
            >
              {getItemIcon(item.type)}
            </span>
          )}
        </div>
      </div>

      <div className="item-info">
        <h2 className="item-name">{item.name}</h2>
        <p className="item-stats-line">{statsLine}</p>
        <p className="item-description">{item.description}</p>
      </div>
    </div>
  );
}
