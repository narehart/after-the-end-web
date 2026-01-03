import { useRef } from 'react';
import classNames from 'classnames/bind';
import { useUIScale } from '../hooks/useUIScale';
import { useInventoryStore } from '../stores/inventoryStore';
import useInventoryState from '../hooks/useInventoryState';
import useCellSize from '../hooks/useCellSize';
import usePanelNavigation from '../hooks/usePanelNavigation';
import useGamepadNavigation from '../hooks/useGamepadNavigation';
import useUIScaleSync from '../hooks/useUIScaleSync';
import EquipmentPanel from './EquipmentPanel';
import InventoryPanel from './InventoryPanel';
import WorldPanel from './WorldPanel';
import DetailsPanel from './DetailsPanel';
import Menu from './Menu';
import InventoryHeader from './InventoryHeader';
import styles from './Inventory.module.css';

const cx = classNames.bind(styles);

export default function Inventory(): React.JSX.Element {
  const state = useInventoryState();
  const { setUIScale } = state;
  const menuIsOpen = useInventoryStore((s) => s.menu.isOpen);

  const uiScale = useUIScale();
  const { effectiveResolution, isSimulated, physicalScale } = uiScale;

  const equipmentRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cellSize = useCellSize(worldRef, { resolution: effectiveResolution });

  const panelRefs = { equipment: equipmentRef, inventory: inventoryRef, world: worldRef };
  const { goToNextPanel, goToPrevPanel } = usePanelNavigation({
    refs: panelRefs,
    modalsOpen: menuIsOpen,
  });

  useGamepadNavigation({ onNextPanel: goToNextPanel, onPrevPanel: goToPrevPanel, enabled: true });
  useUIScaleSync(containerRef, physicalScale, setUIScale);

  // Calculate scale needed to fit container in viewport
  const fitScale = Math.min(
    window.innerWidth / effectiveResolution.width,
    window.innerHeight / effectiveResolution.height,
    1
  );
  // Use the smaller of physicalScale and fitScale to ensure container always fits
  const appliedScale = Math.min(physicalScale, fitScale);

  const containerStyle = isSimulated
    ? {
        width: `${effectiveResolution.width}px`,
        height: `${effectiveResolution.height}px`,
        margin: '0 auto',
        boxShadow: '0 0 0 4px var(--border-color)',
        transform: appliedScale !== 1 ? `scale(${appliedScale})` : undefined,
        transformOrigin: 'top center',
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={cx('inventory-container', { simulated: isSimulated })}
      style={containerStyle}
    >
      <InventoryHeader {...uiScale} />

      <main className={cx('inventory-main')}>
        <aside className={cx('left-column')} ref={equipmentRef}>
          <EquipmentPanel />
        </aside>
        <section className={cx('inventory-column')} ref={inventoryRef}>
          <InventoryPanel cellSize={cellSize} />
          <DetailsPanel />
        </section>
        <section className={cx('world-column')} ref={worldRef}>
          <WorldPanel cellSize={cellSize} />
        </section>
      </main>

      <Menu />
    </div>
  );
}
