import { useEffect, useRef, useCallback, useState } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useGamepad } from '../hooks/useGamepad';
import { useUIScale, PRESETS } from '../hooks/useUIScale';

const GRID_COLUMNS = 10; // Base number of columns for cell size calculation
const CELL_GAP = 2; // Gap between cells in pixels
const GRID_PADDING = 4; // Padding around grid in pixels
const GRID_BORDER = 4; // Border width in pixels
const CONTENT_PADDING = 16; // .container-view-content padding (0.5rem * 2)
const MIN_CELL_SIZE = 24; // Minimum cell size for readability
import EquipmentPanel from './EquipmentPanel';
import InventoryPanel from './InventoryPanel';
import WorldPanel from './WorldPanel';
import DetailsPanel from './DetailsPanel';
import ItemActionModal from './ItemActionModal';
import DestinationPicker from './DestinationPicker';
import './Inventory.css';

// Panel order for bumper navigation (LB/RB)
const PANELS = ['equipment', 'inventory', 'world'];

export default function Inventory() {
  const actionModal = useInventoryStore((state) => state.actionModal);
  const destinationPicker = useInventoryStore((state) => state.destinationPicker);
  const items = useInventoryStore((state) => state.items);
  const closeActionModal = useInventoryStore((state) => state.closeActionModal);
  const closeDestinationPicker = useInventoryStore((state) => state.closeDestinationPicker);
  const openDestinationPicker = useInventoryStore((state) => state.openDestinationPicker);
  const closeAllModals = useInventoryStore((state) => state.closeAllModals);
  const unequipItem = useInventoryStore((state) => state.unequipItem);

  // UI scaling for different resolutions
  const {
    effectiveResolution,
    setPreset,
    isSimulated,
    physicalScale,
    setPhysicalScale,
    steamDeckMode,
    enableSteamDeckMode,
    disableSteamDeckMode,
  } = useUIScale();
  const [showResolutionPicker, setShowResolutionPicker] = useState(false);

  const activePanelRef = useRef(0); // 0 = equipment, 1 = inventory, 2 = world
  const equipmentRef = useRef(null);
  const inventoryRef = useRef(null);
  const worldRef = useRef(null);

  // Shared cell size calculated from world column width
  const [cellSize, setCellSize] = useState(32);

  // Calculate cell size based on world column width fitting 20 columns
  useEffect(() => {
    const calculateCellSize = () => {
      if (worldRef.current) {
        const containerWidth = worldRef.current.clientWidth;
        if (containerWidth > 0) {
          // Calculate cell size as if we need to fit 20 columns
          const totalGaps = (GRID_COLUMNS - 1) * CELL_GAP;
          const availableWidth = containerWidth - GRID_BORDER - totalGaps - (2 * GRID_PADDING) - CONTENT_PADDING;
          const newCellSize = Math.floor(availableWidth / GRID_COLUMNS);
          setCellSize(Math.max(MIN_CELL_SIZE, newCellSize));
        }
      }
    };

    const timeoutId = setTimeout(calculateCellSize, 10);
    const resizeObserver = new ResizeObserver(calculateCellSize);
    if (worldRef.current) {
      resizeObserver.observe(worldRef.current);
    }
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [effectiveResolution]); // Recalculate when resolution changes

  const focusPanel = useCallback((panelIndex) => {
    activePanelRef.current = panelIndex;
    const panel = PANELS[panelIndex];

    // Find and focus the first focusable element in the target panel
    let targetRef;
    if (panel === 'equipment') {
      targetRef = equipmentRef;
    } else if (panel === 'inventory') {
      targetRef = inventoryRef;
    } else if (panel === 'world') {
      targetRef = worldRef;
    }

    if (targetRef?.current) {
      const focusable = targetRef.current.querySelector('[tabindex="0"]');
      if (focusable) {
        focusable.focus();
      }
    }
  }, []);

  // Simulate keyboard events for gamepad input
  const simulateKey = useCallback((key) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    });
    document.activeElement?.dispatchEvent(event);
  }, []);

  // Gamepad handlers
  const handleGamepadNavigate = useCallback((direction) => {
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    simulateKey(keyMap[direction]);
  }, [simulateKey]);

  const handleGamepadConfirm = useCallback(() => {
    simulateKey('Enter');
  }, [simulateKey]);

  const handleGamepadBack = useCallback(() => {
    simulateKey('Escape');
  }, [simulateKey]);

  const handleGamepadNextPanel = useCallback(() => {
    if (actionModal.isOpen || destinationPicker.isOpen) return;
    const newIndex = Math.min(PANELS.length - 1, activePanelRef.current + 1);
    focusPanel(newIndex);
  }, [actionModal.isOpen, destinationPicker.isOpen, focusPanel]);

  const handleGamepadPrevPanel = useCallback(() => {
    if (actionModal.isOpen || destinationPicker.isOpen) return;
    const newIndex = Math.max(0, activePanelRef.current - 1);
    focusPanel(newIndex);
  }, [actionModal.isOpen, destinationPicker.isOpen, focusPanel]);

  // Use gamepad hook
  const { isConnected: gamepadConnected, gamepadName } = useGamepad({
    onNavigate: handleGamepadNavigate,
    onConfirm: handleGamepadConfirm,
    onBack: handleGamepadBack,
    onNextPanel: handleGamepadNextPanel,
    onPrevPanel: handleGamepadPrevPanel,
    enabled: true,
  });

  // Track previous modal state to restore focus when modal closes
  const prevModalOpenRef = useRef(false);
  const lastModalContextRef = useRef(null);

  useEffect(() => {
    // Store context when modal opens
    if (actionModal.isOpen && !prevModalOpenRef.current) {
      lastModalContextRef.current = actionModal.context;
    }

    // Restore focus when modal closes
    if (!actionModal.isOpen && prevModalOpenRef.current && !destinationPicker.isOpen) {
      // Small delay to let React finish updating
      setTimeout(() => {
        const context = lastModalContextRef.current;
        if (context === 'equipment') {
          focusPanel(0);
        } else if (context === 'grid') {
          focusPanel(1);
        } else if (context === 'ground' || context === 'world') {
          focusPanel(2);
        } else {
          // Default to inventory panel
          focusPanel(1);
        }
      }, 50);
    }

    prevModalOpenRef.current = actionModal.isOpen;
  }, [actionModal.isOpen, actionModal.context, destinationPicker.isOpen, focusPanel]);

  // Handle LB/RB bumper keys for panel switching
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if modals are open
      if (actionModal.isOpen || destinationPicker.isOpen) return;

      if (e.key === '[' || e.key === 'q') {
        // LB - previous panel
        e.preventDefault();
        const newIndex = Math.max(0, activePanelRef.current - 1);
        focusPanel(newIndex);
      } else if (e.key === ']' || e.key === 'e') {
        // RB - next panel
        e.preventDefault();
        const newIndex = Math.min(PANELS.length - 1, activePanelRef.current + 1);
        focusPanel(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionModal.isOpen, destinationPicker.isOpen, focusPanel]);

  const handleDestinationPick = (action) => {
    openDestinationPicker(action, actionModal.itemId);
  };

  const handleDestinationSelect = (destination) => {
    const { action, itemId } = destinationPicker;

    if (action === 'unequip') {
      const success = unequipItem(itemId, destination.id);
      if (!success) {
        console.error('Failed to unequip item - no space in destination');
      }
    } else if (action === 'move') {
      // TODO: Implement move logic
      console.log(`Moving item ${itemId} to ${destination.id}`);
    }

    closeAllModals();
  };

  // Container style - constrained to simulated resolution if active
  const containerStyle = isSimulated ? {
    width: `${effectiveResolution.width}px`,
    height: `${effectiveResolution.height}px`,
    margin: '0 auto',
    boxShadow: '0 0 0 4px var(--border-color)',
    transform: physicalScale !== 1 ? `scale(${physicalScale})` : undefined,
    transformOrigin: 'top center',
  } : {};

  return (
    <div
      className={`inventory-container ${isSimulated ? 'simulated' : ''}`}
      style={containerStyle}
    >
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
                  onClick={() => {
                    setPreset(key);
                    if (key !== 'steam-deck') {
                      disableSteamDeckMode();
                    }
                    setShowResolutionPicker(false);
                  }}
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
                onClick={() => steamDeckMode ? disableSteamDeckMode() : enableSteamDeckMode()}
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
      <main className="inventory-main">
        <aside className="left-column" ref={equipmentRef}>
          <EquipmentPanel />
          <DetailsPanel />
        </aside>
        <section className="inventory-column" ref={inventoryRef}>
          <InventoryPanel cellSize={cellSize} />
        </section>
        <section className="world-column" ref={worldRef}>
          <WorldPanel cellSize={cellSize} />
        </section>
      </main>

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.itemId && (
        <ItemActionModal
          item={items[actionModal.itemId]}
          position={actionModal.position}
          context={actionModal.context}
          onClose={closeActionModal}
          onDestinationPick={handleDestinationPick}
          isActive={!destinationPicker.isOpen}
        />
      )}

      {/* Destination Picker Modal */}
      {destinationPicker.isOpen && destinationPicker.itemId && (
        <DestinationPicker
          action={destinationPicker.action}
          item={items[destinationPicker.itemId]}
          position={{ x: actionModal.position.x + 170, y: actionModal.position.y }}
          onSelect={handleDestinationSelect}
          onClose={closeDestinationPicker}
        />
      )}
    </div>
  );
}
