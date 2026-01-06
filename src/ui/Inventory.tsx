import { useRef } from 'react';
import classNames from 'classnames/bind';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../constants/ui';
import { useInventoryStore } from '../stores/inventoryStore';
import useCellSize from '../hooks/useCellSize';
import usePanelNavigation from '../hooks/usePanelNavigation';
import useGamepadNavigation from '../hooks/useGamepadNavigation';
import EquipmentPanel from './EquipmentPanel';
import InventoryPanel from './InventoryPanel';
import WorldPanel from './WorldPanel';
import DetailsPanel from './DetailsPanel';
import ActionModal from './ActionModal';
import styles from './Inventory.module.css';
import { Box, Flex } from '.';

const cx = classNames.bind(styles);

export default function Inventory(): React.JSX.Element {
  const menuIsOpen = useInventoryStore((s) => s.menu.isOpen);

  const equipmentRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  const referenceResolution = { width: REFERENCE_WIDTH, height: REFERENCE_HEIGHT };
  const cellSize = useCellSize(worldRef, { resolution: referenceResolution });

  const panelRefs = { equipment: equipmentRef, inventory: inventoryRef, world: worldRef };
  const { goToNextPanel, goToPrevPanel } = usePanelNavigation({
    refs: panelRefs,
    modalsOpen: menuIsOpen,
  });

  useGamepadNavigation({ onNextPanel: goToNextPanel, onPrevPanel: goToPrevPanel, enabled: true });

  return (
    <Flex direction="column" className={cx('inventory-content')}>
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
