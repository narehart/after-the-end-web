import { useInventoryStore } from '../stores/inventoryStore';
import ContainerView from './ContainerView';
import './InventoryPanel.css';

export default function InventoryPanel({ cellSize }) {
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const handleNavigateBack = (index) => {
    navigateBack(index, 'inventory');
  };

  return (
    <div className="inventory-panel">
      <ContainerView
        focusPath={inventoryFocusPath}
        onNavigateBack={handleNavigateBack}
        emptyMessage="Select an equipped container to view its contents"
        panelType="inventory"
        panelIcon="🎒"
        panelLabel="Inventory"
        cellSize={cellSize}
      />
    </div>
  );
}
