import classNames from 'classnames/bind';
import useECSInit from '../hooks/useECSInit';
import useInputModeDetection from '../hooks/useInputModeDetection';
import { useViewportScale } from '../hooks/useViewportScale';
import { useInventoryStore } from '../stores/inventoryStore';
import MainHeader from './MainHeader';
import Inventory from './Inventory';
import styles from './App.module.css';
import { Flex, Text } from '.';

const cx = classNames.bind(styles);

function App(): React.JSX.Element {
  useECSInit();
  useInputModeDetection();

  const activeScreen = useInventoryStore((s) => s.activeScreen);
  const { containerStyle } = useViewportScale();

  const renderScreen = (): React.JSX.Element => {
    switch (activeScreen) {
      case 'inventory':
        return <Inventory />;
      case 'character':
        return (
          <Flex justify="center" align="center" className={cx('placeholder-screen')}>
            <Text type="muted">Character Screen (TODO)</Text>
          </Flex>
        );
      case 'status':
        return (
          <Flex justify="center" align="center" className={cx('placeholder-screen')}>
            <Text type="muted">Status Screen (TODO)</Text>
          </Flex>
        );
      case 'camping':
        return (
          <Flex justify="center" align="center" className={cx('placeholder-screen')}>
            <Text type="muted">Camping Screen (TODO)</Text>
          </Flex>
        );
      case 'settings':
        return (
          <Flex justify="center" align="center" className={cx('placeholder-screen')}>
            <Text type="muted">Settings Screen (TODO)</Text>
          </Flex>
        );
    }
  };

  return (
    <Flex direction="column" className={cx('app-container')} style={containerStyle}>
      <MainHeader />
      {renderScreen()}
    </Flex>
  );
}

export default App;
