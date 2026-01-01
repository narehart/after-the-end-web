import { useRef } from 'react';
import { useUIScale } from '../hooks/useUIScale';
import useInventoryState from '../hooks/useInventoryState';
import useCellSize from '../hooks/useCellSize';
import usePanelNavigation from '../hooks/usePanelNavigation';
import useGamepadNavigation from '../hooks/useGamepadNavigation';
import useModalFocusRestore from '../hooks/useModalFocusRestore';
import useDestinationHandler from '../hooks/useDestinationHandler';
import useUIScaleSync from '../hooks/useUIScaleSync';
import useActionModalWidth from '../hooks/useActionModalWidth';
import EquipmentPanel from './EquipmentPanel';
import InventoryPanel from './InventoryPanel';
import WorldPanel from './WorldPanel';
import DetailsPanel from './DetailsPanel';
import InventoryModals from './InventoryModals';
import InventoryHeader from './InventoryHeader';
import './Inventory.css';

export default function Inventory() {
  const state = useInventoryState();
  const { actionModal, destinationPicker, items, setUIScale } = state;

  const uiScale = useUIScale();
  const { effectiveResolution, isSimulated, physicalScale } = uiScale;

  const equipmentRef = useRef(null);
  const inventoryRef = useRef(null);
  const worldRef = useRef(null);
  const containerRef = useRef(null);
  const actionModalRef = useRef(null);

  const cellSize = useCellSize(worldRef, effectiveResolution);
  const actionModalWidth = useActionModalWidth(actionModalRef, actionModal.isOpen);
  const modalsOpen = actionModal.isOpen || destinationPicker.isOpen;

  const panelRefs = { equipment: equipmentRef, inventory: inventoryRef, world: worldRef };
  const { focusPanel, goToNextPanel, goToPrevPanel } = usePanelNavigation(panelRefs, modalsOpen);

  useGamepadNavigation({ onNextPanel: goToNextPanel, onPrevPanel: goToPrevPanel, enabled: true });
  useUIScaleSync(containerRef, physicalScale, setUIScale);
  useModalFocusRestore(actionModal, destinationPicker.isOpen, focusPanel);

  const destinationHandler = useDestinationHandler();

  const containerStyle = isSimulated
    ? {
        width: `${effectiveResolution.width}px`,
        height: `${effectiveResolution.height}px`,
        margin: '0 auto',
        boxShadow: '0 0 0 4px var(--border-color)',
        transform: physicalScale !== 1 ? `scale(${physicalScale})` : undefined,
        transformOrigin: 'top center',
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={`inventory-container ${isSimulated ? 'simulated' : ''}`}
      style={containerStyle}
    >
      <InventoryHeader {...uiScale} />

      <main className="inventory-main">
        <aside className="left-column" ref={equipmentRef}>
          <EquipmentPanel />
        </aside>
        <section className="inventory-column" ref={inventoryRef}>
          <InventoryPanel cellSize={cellSize} />
          <DetailsPanel />
        </section>
        <section className="world-column" ref={worldRef}>
          <WorldPanel cellSize={cellSize} />
        </section>
      </main>

      <InventoryModals
        actionModal={actionModal}
        destinationPicker={destinationPicker}
        items={items}
        actionModalRef={actionModalRef}
        actionModalWidth={actionModalWidth}
        physicalScale={physicalScale}
        {...state}
        {...destinationHandler}
      />
    </div>
  );
}
