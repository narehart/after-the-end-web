import { useState } from 'react';
import classNames from 'classnames/bind';
import { PRESETS } from '../constants/display';
import useGamepadStatus from '../hooks/useGamepadStatus';
import type { Resolution } from '../types/ui';
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
    <header className={cx('inventory-header')}>
      <span className={cx('header-icon')}>☢</span>
      <h1 className={cx('header-title')}>INVENTORY</h1>
      <div className={cx('header-controls')}>
        {gamepadConnected ? (
          <span className={cx('gamepad-indicator')} title={gamepadName}>
            🎮 Connected
          </span>
        ) : null}
        <button
          className={cx('resolution-btn')}
          onClick={() => {
            setShowResolutionPicker(!showResolutionPicker);
          }}
          title="Test different resolutions"
        >
          {effectiveResolution.width}×{effectiveResolution.height}
        </button>
        {showResolutionPicker ? (
          <div className={cx('resolution-picker')}>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                className={cx('resolution-option')}
                onClick={() => {
                  handlePresetSelect(key);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        ) : null}
        {isSimulated ? (
          <div className={cx('steam-deck-controls')}>
            <button
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
              {steamDeckMode ? `🎮 ${Math.round(physicalScale * 100)}%` : '🎮 1:1'}
            </button>
            {steamDeckMode ? (
              <input
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
          </div>
        ) : null}
        <span className={cx('weight-indicator')}>12.4 / 35.0 kg</span>
        <button className={cx('close-btn')}>✕</button>
      </div>
    </header>
  );
}
