import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import ContainerView from './ContainerView';
import styles from './InventoryPanel.module.css';

const cx = classNames.bind(styles);

export default function InventoryPanel({ cellSize }) {
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const handleNavigateBack = (index) => {
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
