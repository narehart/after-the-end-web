import { useInventoryStore } from '../stores/inventoryStore';
import ContainerView from './ContainerView';
import './WorldPanel.css';

export default function WorldPanel({ cellSize }) {
  const worldFocusPath = useInventoryStore((state) => state.worldFocusPath);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const handleNavigateBack = (index) => {
    navigateBack(index, 'world');
  };

  return (
    <div className="world-panel">
      <ContainerView
        focusPath={worldFocusPath}
        onNavigateBack={handleNavigateBack}
        emptyMessage="Nothing nearby"
        panelType="world"
        panelLabel="Ground"
        cellSize={cellSize}
      />
    </div>
  );
}
