import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import ContainerView from './ContainerView';
import styles from './InventoryPanel.module.css';

const cx = classNames.bind(styles);

interface InventoryPanelProps {
  cellSize: number;
}

export default function InventoryPanel({ cellSize }: InventoryPanelProps): React.JSX.Element {
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const handleNavigateBack = (index: number): void => {
    navigateBack(index, 'inventory');
  };

  return (
    <div className={cx('inventory-panel')}>
      <ContainerView
        focusPath={inventoryFocusPath}
        onNavigateBack={handleNavigateBack}
        emptyMessage="Select an equipped container to view its contents"
        panelType="inventory"
        panelLabel="Inventory"
        cellSize={cellSize}
      />
    </div>
  );
}
