import classNames from 'classnames/bind';
import { SCREEN_TABS } from '../constants/ui';
import { useInventoryStore } from '../stores/inventoryStore';
import useGamepadStatus from '../hooks/useGamepadStatus';
import useDisplayInfo from '../hooks/useDisplayInfo';
import type { ScreenId } from '../types/ui';
import styles from './MainHeader.module.css';
import { Flex, Text } from '.';

const cx = classNames.bind(styles);

export default function MainHeader(): React.JSX.Element {
  const activeScreen = useInventoryStore((s) => s.activeScreen);
  const setActiveScreen = useInventoryStore((s) => s.setActiveScreen);
  const { isConnected: gamepadConnected, gamepadName } = useGamepadStatus();
  const { displayInfo } = useDisplayInfo();

  const handleTabClick = (screenId: ScreenId): void => {
    setActiveScreen(screenId);
  };

  const resolutionLabel =
    displayInfo !== null
      ? `${displayInfo.width}×${displayInfo.height} (${displayInfo.aspectRatioLabel})`
      : 'Loading...';

  return (
    <Flex as="header" align="center" className={cx('main-header')}>
      <Text className={cx('header-icon')}>☢</Text>
      <Flex as="nav" align="center" gap="4" className={cx('screen-tabs')}>
        {SCREEN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cx('screen-tab', { 'screen-tab--active': activeScreen === tab.id })}
            onClick={() => {
              handleTabClick(tab.id);
            }}
          >
            <Text size="sm" uppercase spacing="wide">
              {tab.label}
            </Text>
          </button>
        ))}
      </Flex>
      <Flex align="center" gap="12" className={cx('header-controls')}>
        {gamepadConnected ? (
          <Text size="sm" className={cx('gamepad-indicator')} title={gamepadName}>
            🎮 Connected
          </Text>
        ) : null}
        <Text type="secondary" code size="sm" className={cx('resolution-indicator')}>
          {resolutionLabel}
        </Text>
        <Flex as="button" justify="center" align="center" className={cx('close-btn')}>
          <Text type="secondary" size="sm">
            ✕
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
