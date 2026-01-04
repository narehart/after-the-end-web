import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import ContainerView from './ContainerView';
import { Flex } from './shared';
import styles from './WorldPanel.module.css';

const cx = classNames.bind(styles);

interface WorldPanelProps {
  cellSize: number | null;
}

export default function WorldPanel({ cellSize }: WorldPanelProps): React.JSX.Element {
  const worldFocusPath = useInventoryStore((state) => state.worldFocusPath);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const handleNavigateBack = (index: number): void => {
    navigateBack(index, 'world');
  };

  return (
    <Flex direction="column" className={cx('world-panel')}>
      <ContainerView
        focusPath={worldFocusPath}
        onNavigateBack={handleNavigateBack}
        emptyMessage="Nothing nearby"
        panelType="world"
        panelLabel="Ground"
        cellSize={cellSize}
      />
    </Flex>
  );
}
