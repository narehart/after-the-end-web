import { useState } from 'react';
import classNames from 'classnames/bind';
import { PRESETS } from '../constants/display';
import { PERCENTAGE_MULTIPLIER } from '../constants/numbers';
import useGamepadStatus from '../hooks/useGamepadStatus';
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

export default function InventoryHeader({
  effectiveResolution,
  setPreset,
  isSimulated,
  physicalScale,
  setPhysicalScale,
  steamDeckMode,
  enableSteamDeckMode,
  disableSteamDeckMode,
}: InventoryHeaderProps): React.JSX.Element {
  const [showResolutionPicker, setShowResolutionPicker] = useState(false);
  const { isConnected: gamepadConnected, gamepadName } = useGamepadStatus();

  const handlePresetSelect = (key: string): void => {
    setPreset(key);
    if (key !== 'steam-deck') {
      disableSteamDeckMode();
    }
    setShowResolutionPicker(false);
  };

  return (
    <Flex as="header" align="center" className={cx('inventory-header')}>
      <Text className={cx('header-icon')}>☢</Text>
      <Text as="h1" strong className={cx('header-title')}>
        INVENTORY
      </Text>
      <Flex align="center" gap="12" className={cx('header-controls')}>
        {gamepadConnected ? (
          <Text className={cx('gamepad-indicator')} title={gamepadName}>
            🎮 Connected
          </Text>
        ) : null}
        <Button
          className={cx('resolution-btn')}
          onClick={() => {
            setShowResolutionPicker(!showResolutionPicker);
          }}
          title="Test different resolutions"
        >
          {effectiveResolution.width}×{effectiveResolution.height}
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
                {preset.label}
              </Button>
            ))}
          </Box>
        ) : null}
        {isSimulated ? (
          <Flex align="center" gap="8" className={cx('steam-deck-controls')}>
            <Button
              className={cx('steam-deck-btn', { active: steamDeckMode })}
              onClick={() => {
                if (steamDeckMode) {
                  disableSteamDeckMode();
                } else {
                  enableSteamDeckMode();
                }
              }}
              title="Toggle Steam Deck physical size simulation"
            >
              {steamDeckMode
                ? `🎮 ${Math.round(physicalScale * PERCENTAGE_MULTIPLIER)}%`
                : '🎮 1:1'}
            </Button>
            {steamDeckMode ? (
              <Input
                type="range"
                className={cx('scale-slider')}
                min={0.3}
                max={1.0}
                step={0.01}
                value={physicalScale}
                onChange={(e) => {
                  setPhysicalScale(parseFloat(e.target.value));
                }}
                title="Fine-tune physical scale"
              />
            ) : null}
          </Flex>
        ) : null}
        <Text type="secondary" code className={cx('weight-indicator')}>
          12.4 / 35.0 kg
        </Text>
        <Flex as="button" justify="center" align="center" className={cx('close-btn')}>
          ✕
        </Flex>
      </Flex>
    </Flex>
  );
}
