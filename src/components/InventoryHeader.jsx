import { useState } from 'react';
import { PRESETS } from '../hooks/useUIScale';
import useGamepadStatus from '../hooks/useGamepadStatus';
import './InventoryHeader.css';

export default function InventoryHeader({
  effectiveResolution,
  setPreset,
  isSimulated,
  physicalScale,
  setPhysicalScale,
  steamDeckMode,
  enableSteamDeckMode,
  disableSteamDeckMode,
}) {
  const [showResolutionPicker, setShowResolutionPicker] = useState(false);
  const { isConnected: gamepadConnected, gamepadName } = useGamepadStatus();

  const handlePresetSelect = (key) => {
    setPreset(key);
    if (key !== 'steam-deck') {
      disableSteamDeckMode();
    }
    setShowResolutionPicker(false);
  };

  return (
    <header className="inventory-header">
      <span className="header-icon">☢</span>
      <h1 className="header-title">INVENTORY</h1>
      <div className="header-controls">
        {gamepadConnected && (
          <span className="gamepad-indicator" title={gamepadName}>
            🎮 Connected
          </span>
        )}
        <button
          className="resolution-btn"
          onClick={() => setShowResolutionPicker(!showResolutionPicker)}
          title="Test different resolutions"
        >
          {effectiveResolution.width}×{effectiveResolution.height}
        </button>
        {showResolutionPicker && (
          <div className="resolution-picker">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                className="resolution-option"
                onClick={() => handlePresetSelect(key)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        {isSimulated && (
          <div className="steam-deck-controls">
            <button
              className={`steam-deck-btn ${steamDeckMode ? 'active' : ''}`}
              onClick={() => (steamDeckMode ? disableSteamDeckMode() : enableSteamDeckMode())}
              title="Toggle Steam Deck physical size simulation"
            >
              {steamDeckMode ? `🎮 ${Math.round(physicalScale * 100)}%` : '🎮 1:1'}
            </button>
            {steamDeckMode && (
              <input
                type="range"
                className="scale-slider"
                min={0.3}
                max={1.0}
                step={0.01}
                value={physicalScale}
                onChange={(e) => setPhysicalScale(parseFloat(e.target.value))}
                title="Fine-tune physical scale"
              />
            )}
          </div>
        )}
        <span className="weight-indicator">12.4 / 35.0 kg</span>
        <button className="close-btn">✕</button>
      </div>
    </header>
  );
}
