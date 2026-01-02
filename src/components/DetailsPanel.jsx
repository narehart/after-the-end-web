import { useInventoryStore } from '../stores/inventoryStore';
import Panel from './Panel';
import EmptySlotDetails from './EmptySlotDetails';
import ItemPreview from './ItemPreview';
import './DetailsPanel.css';

function buildStatsLine(item) {
  return [
    item.type.toUpperCase(),
    item.stats.weight != null ? `${item.stats.weight}kg` : null,
    item.stats.durability != null ? `${item.stats.durability}%` : null,
    item.stackable && item.quantity > 1 ? `×${item.quantity}` : null,
  ].filter(Boolean).join(' · ');
}

export default function DetailsPanel() {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusedEmptySlot = useInventoryStore((state) => state.focusedEmptySlot);
  const items = useInventoryStore((state) => state.items);

  const item = selectedItemId ? items[selectedItemId] : null;

  if (!item && focusedEmptySlot) {
    return <EmptySlotDetails slotId={focusedEmptySlot} />;
  }

  if (!item) {
    return (
      <Panel border="top" className="details-panel" contentClassName="details-content empty">
        <div className="empty-state">
          <p className="empty-text">Select an item to view details</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel border="top" className="details-panel" contentClassName="details-content">
      <div className="item-preview">
        <div className="preview-frame">
          <ItemPreview item={item} />
        </div>
      </div>

      <div className="item-info">
        <h2 className="item-name">{item.name}</h2>
        <p className="item-stats-line">{buildStatsLine(item)}</p>
        <p className="item-description">{item.description}</p>
      </div>
    </Panel>
  );
}
