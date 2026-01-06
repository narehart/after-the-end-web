import { useRef } from 'react';
import classNames from 'classnames/bind';
import { DEFAULT_SCALE } from '../constants/grid';
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
import ActionModal from './ActionModal';
import InventoryHeader from './InventoryHeader';
import styles from './Inventory.module.css';
import { Box, Flex } from '.';

;

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
    DEFAULT_SCALE
  );
  // Use the smaller of physicalScale and fitScale to ensure container always fits
  const appliedScale = Math.min(physicalScale, fitScale);

  const containerStyle = isSimulated
    ? {
        width: `${effectiveResolution.width}px`,
        height: `${effectiveResolution.height}px`,
        margin: '0 auto',
        boxShadow: '0 0 0 4px var(--border-color)',
        transform: appliedScale !== DEFAULT_SCALE ? `scale(${String(appliedScale)})` : undefined,
        transformOrigin: 'top center',
      }
    : {};

  return (
    <Flex
      ref={containerRef}
      direction="column"
      className={cx('inventory-container', { simulated: isSimulated })}
      style={containerStyle}
    >
      <InventoryHeader {...uiScale} />

      <Box
        as="main"
        className={cx('inventory-main')}
        style={{ visibility: cellSize !== null ? 'visible' : 'hidden' }}
      >
        <Flex as="aside" direction="column" className={cx('left-column')} ref={equipmentRef}>
          <EquipmentPanel />
        </Flex>
        <Flex as="section" direction="column" className={cx('inventory-column')} ref={inventoryRef}>
          <InventoryPanel cellSize={cellSize} />
          <DetailsPanel />
        </Flex>
        <Flex as="section" direction="column" className={cx('world-column')} ref={worldRef}>
          <WorldPanel cellSize={cellSize} />
        </Flex>
      </Box>

      <ActionModal />
    </Flex>
  );
}
