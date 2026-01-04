import classNames from 'classnames/bind';
import { PRESETS } from '../constants/display';
import useGamepadStatus from '../hooks/useGamepadStatus';
import useInventoryHeader from '../hooks/useInventoryHeader';
import type { Resolution } from '../types/ui';
import { Box, Button, Flex, Input, Text } from './primitives';
import styles from './InventoryHeader.module.css';

const cx = classNames.bind(styles);

interface InventoryHeaderProps {
  effectiveResolution: Resolution;
  setPreset: (key: string) => void;
  isSimulated: boolean;
  physicalScale: number;
  setPhysicalScale: (scale: number) => void;
  steamDeckMode: boolean;
  enableSteamDeckMode: () => void;
  disableSteamDeckMode: () => void;
}

export default function InventoryHeader(props: InventoryHeaderProps): React.JSX.Element {
  const { effectiveResolution, isSimulated, physicalScale, steamDeckMode } = props;
  const { isConnected: gamepadConnected, gamepadName } = useGamepadStatus();
  const {
    showResolutionPicker,
    steamDeckLabel,
    handlePresetSelect,
    toggleResolutionPicker,
    toggleSteamDeck,
    handleScaleChange,
  } = useInventoryHeader(props);

  return (
    <Flex as="header" align="center" className={cx('inventory-header')}>
      <Text className={cx('header-icon')}>☢</Text>
      <Text as="h1" size="lg" strong uppercase spacing="wide" className={cx('header-title')}>
        INVENTORY
      </Text>
      <Flex align="center" gap="12" className={cx('header-controls')}>
        {gamepadConnected ? (
          <Text size="sm" className={cx('gamepad-indicator')} title={gamepadName}>
            🎮 Connected
          </Text>
        ) : null}
        <Button
          className={cx('resolution-btn')}
          onClick={toggleResolutionPicker}
          title="Test different resolutions"
        >
          <Text type="muted" code>
            {effectiveResolution.width}×{effectiveResolution.height}
          </Text>
        </Button>
        {showResolutionPicker ? (
          <Box className={cx('resolution-picker')}>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                className={cx('resolution-option')}
                onClick={() => {
                  handlePresetSelect(key);
                }}
              >
                <Text type="secondary" size="sm">
                  {preset.label}
                </Text>
              </Button>
            ))}
          </Box>
        ) : null}
        {isSimulated ? (
          <Flex align="center" gap="8" className={cx('steam-deck-controls')}>
            <Button
              className={cx('steam-deck-btn', { active: steamDeckMode })}
              onClick={toggleSteamDeck}
              title="Toggle Steam Deck physical size simulation"
            >
              <Text type="muted" code>
                {steamDeckLabel}
              </Text>
            </Button>
            {steamDeckMode ? (
              <Input
                type="range"
                className={cx('scale-slider')}
                min={0.3}
                max={1.0}
                step={0.01}
                value={physicalScale}
                onChange={handleScaleChange}
                title="Fine-tune physical scale"
              />
            ) : null}
          </Flex>
        ) : null}
        <Text type="secondary" code size="sm" className={cx('weight-indicator')}>
          12.4 / 35.0 kg
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
