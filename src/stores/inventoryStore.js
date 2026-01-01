import { create } from 'zustand';

// Equipment slot types
export const SLOT_TYPES = [
  'helmet',
  'eyes',
  'face',
  'neck',
  'backpack',
  'coat',
  'vest',
  'shirt',
  'rightShoulder',
  'leftShoulder',
  'rightGlove',
  'leftGlove',
  'rightRing',
  'leftRing',
  'rightHolding',
  'leftHolding',
  'pouch',
  'pants',
  'rightShoe',
  'leftShoe',
];

export const SLOT_LABELS = {
  helmet: 'Helmet',
  eyes: 'Eyes',
  face: 'Face',
  neck: 'Neck',
  backpack: 'Backpack',
  coat: 'Coat',
  vest: 'Vest',
  shirt: 'Shirt',
  rightShoulder: 'Right Shoulder',
  leftShoulder: 'Left Shoulder',
  rightGlove: 'Right Glove',
  leftGlove: 'Left Glove',
  rightRing: 'Right Ring',
  leftRing: 'Left Ring',
  rightHolding: 'Right Holding',
  leftHolding: 'Left Holding',
  pouch: 'Pouch',
  pants: 'Pants',
  rightShoe: 'Right Shoe',
  leftShoe: 'Left Shoe',
};

// Items using Neo Scavenger assets for prototyping
const mockItems = {
  'backpack-1': {
    id: 'backpack-1',
    type: 'container',
    name: 'Canvas Backpack',
    description: 'Pearson "Yukon" canvas backpack. Sturdy and spacious.',
    size: { width: 3, height: 4 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 1.2, durability: 75 },
    gridSize: { width: 10, height: 10 },
    equippableSlots: ['backpack'],
    image: 'ItmBackpack.png',
  },
  'pouch-1': {
    id: 'pouch-1',
    type: 'container',
    name: 'Plastic Bag',
    description: 'Disposable plastic shopping bag. Surprisingly useful.',
    size: { width: 2, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.01, durability: 30 },
    gridSize: { width: 4, height: 6 },
    equippableSlots: ['pouch', 'rightHolding', 'leftHolding'],
    image: 'ItmPlasticShoppingBag.png',
  },
  'medkit-1': {
    id: 'medkit-1',
    type: 'container',
    name: 'Medical Kit',
    description: 'Portable first aid kit with basic medical supplies.',
    size: { width: 3, height: 3 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.5, durability: 100 },
    gridSize: { width: 3, height: 3 },
    equippableSlots: [],
    image: 'ItmRMK.png',
  },
  'water-1': {
    id: 'water-1',
    type: 'container',
    name: 'Water Bottle',
    description: '"Erie" brand plastic water bottle.',
    size: { width: 1, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.6, hydration: 30 },
    gridSize: { width: 2, height: 3 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmBottleWater.png',
    spriteVertical: true, // Sprite is already vertical, no rotation needed
  },
  'ammo-1': {
    id: 'ammo-1',
    type: 'ammo',
    name: '.308 Rounds',
    description: '.308 FMJ ammunition. Military grade.',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: true,
    quantity: 24,
    stats: { weight: 0.02 },
    equippableSlots: [],
    image: 'ItmAmmo308FMJ.png',
  },
  'knife-1': {
    id: 'knife-1',
    type: 'weapon',
    name: 'Meat Cleaver',
    description: 'Heavy kitchen cleaver. Good for cutting... things.',
    size: { width: 1, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.5, damage: 20, durability: 80 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmCleaverStored.png',
  },
  'coat-1': {
    id: 'coat-1',
    type: 'clothing',
    name: 'Hoodie',
    description: 'Gray hooded sweatshirt. Comfortable and practical.',
    size: { width: 3, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.8, warmth: 30, protection: 2, durability: 60 },
    equippableSlots: ['coat'],
    image: 'ItmHoodieStored.png',
  },
  'can-1': {
    id: 'can-1',
    type: 'consumable',
    name: 'Soup Can',
    description: 'Chef Yummy "Creamy Crumb" soup can.',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: true,
    quantity: 3,
    stats: { weight: 0.07, nutrition: 25 },
    equippableSlots: [],
    image: 'ItmSoupCan.png',
  },
  'flashlight-1': {
    id: 'flashlight-1',
    type: 'tool',
    name: 'Flashlight',
    description: 'Circuit Shack "Carter" flashlight. Currently off.',
    size: { width: 1, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.3, battery: 70, durability: 85 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmFlashlight.png',
  },
  'glasses-1': {
    id: 'glasses-1',
    type: 'accessory',
    name: 'Night Vision Goggles',
    description: 'Military-grade night vision device.',
    size: { width: 2, height: 2 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.4, durability: 70 },
    equippableSlots: ['eyes'],
    image: 'ItmNVGogglesStored.png',
  },
  'pillbottle-1': {
    id: 'pillbottle-1',
    type: 'container',
    name: 'Pill Bottle',
    description: 'Plastic pill bottle. Label reads: Chemico "AquaPura".',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.05 },
    gridSize: { width: 2, height: 2 },
    equippableSlots: [],
    image: 'ItmPillBottle.png',
  },
  'pills-1': {
    id: 'pills-1',
    type: 'consumable',
    name: 'Antibiotics',
    description: 'White antibiotic pills. PharmaCon brand.',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: true,
    quantity: 5,
    stats: { weight: 0.01 },
    equippableSlots: [],
    image: 'ItmAntiBioticsPills.png',
  },
  'rifle-1': {
    id: 'rifle-1',
    type: 'weapon',
    name: 'Hunting Rifle',
    description: '.308 hunting rifle. Well-maintained.',
    size: { width: 2, height: 6 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 3.5, damage: 80, durability: 90 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmHuntingRifleStored.png',
  },
  'crowbar-1': {
    id: 'crowbar-1',
    type: 'tool',
    name: 'Crowbar',
    description: 'Heavy steel crowbar. Useful for prying and fighting.',
    size: { width: 1, height: 4 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 1.5, damage: 25, durability: 95 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmCrowbar.png',
  },
  'berries-1': {
    id: 'berries-1',
    type: 'consumable',
    name: 'Blue Berries',
    description: 'Handful of wild berries. Probably safe to eat.',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: true,
    quantity: 8,
    stats: { weight: 0.05, nutrition: 5 },
    equippableSlots: [],
    image: 'ItmBerriesBlue.png',
  },
  'multitool-1': {
    id: 'multitool-1',
    type: 'tool',
    name: 'Multitool',
    description: 'Pearson "Ravager" multitool pocket knife.',
    size: { width: 1, height: 1 },
    rotation: 0,
    stackable: false,
    quantity: 1,
    stats: { weight: 0.2, durability: 85 },
    equippableSlots: ['rightHolding', 'leftHolding'],
    image: 'ItmMultiTool.png',
  },
};

// Helper to create empty grid
const createEmptyGrid = (width, height) => {
  return Array(height).fill(null).map(() => Array(width).fill(null));
};

// Helper to place item in grid
const placeItem = (cells, itemId, x, y, width, height) => {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      if (y + dy < cells.length && x + dx < cells[0].length) {
        cells[y + dy][x + dx] = itemId;
      }
    }
  }
};

// Initial grid states
const initialGrids = {
  'backpack-1': {
    width: 10,
    height: 10,
    cells: (() => {
      const cells = createEmptyGrid(10, 10);
      // Place medkit (3x3) at (0,0)
      placeItem(cells, 'medkit-1', 0, 0, 3, 3);
      // Place water (1x2) at (3,0)
      placeItem(cells, 'water-1', 3, 0, 1, 2);
      // Place ammo (1x1) at (4,0)
      placeItem(cells, 'ammo-1', 4, 0, 1, 1);
      // Place knife/cleaver (1x2) at (5,0)
      placeItem(cells, 'knife-1', 5, 0, 1, 2);
      // Place can (1x1) at (4,1)
      placeItem(cells, 'can-1', 4, 1, 1, 1);
      // Place flashlight (1x2) at (6,0)
      placeItem(cells, 'flashlight-1', 6, 0, 1, 2);
      // Place pill bottle (1x1) at (7,0)
      placeItem(cells, 'pillbottle-1', 7, 0, 1, 1);
      // Place berries (1x1) at (7,1)
      placeItem(cells, 'berries-1', 7, 1, 1, 1);
      // Place multitool (1x1) at (8,0)
      placeItem(cells, 'multitool-1', 8, 0, 1, 1);
      return cells;
    })(),
  },
  'pouch-1': {
    width: 4,
    height: 6,
    cells: (() => {
      const cells = createEmptyGrid(4, 6);
      return cells;
    })(),
  },
  'medkit-1': {
    width: 3,
    height: 3,
    cells: (() => {
      const cells = createEmptyGrid(3, 3);
      // Place pills inside medkit
      placeItem(cells, 'pills-1', 0, 0, 1, 1);
      return cells;
    })(),
  },
  'pillbottle-1': {
    width: 2,
    height: 2,
    cells: (() => {
      const cells = createEmptyGrid(2, 2);
      return cells;
    })(),
  },
  'water-1': {
    width: 2,
    height: 3,
    cells: (() => {
      const cells = createEmptyGrid(2, 3);
      return cells;
    })(),
  },
  'ground': {
    width: 10,
    height: 40,
    cells: (() => {
      const cells = createEmptyGrid(10, 40);
      // Hoodie (2x3) at (0,0)
      placeItem(cells, 'coat-1', 0, 0, 2, 3);
      // Rifle (2x6) at (3,0)
      placeItem(cells, 'rifle-1', 3, 0, 2, 6);
      // Crowbar (1x4) at (6,0)
      placeItem(cells, 'crowbar-1', 6, 0, 1, 4);
      return cells;
    })(),
  },
};

export const useInventoryStore = create((set, get) => ({
  // Equipment slots
  equipment: {
    helmet: null,
    eyes: 'glasses-1',
    face: null,
    neck: null,
    backpack: 'backpack-1',
    coat: null,
    vest: null,
    shirt: null,
    rightShoulder: null,
    leftShoulder: null,
    rightGlove: null,
    leftGlove: null,
    rightRing: null,
    leftRing: null,
    rightHolding: null,
    leftHolding: null,
    pouch: 'pouch-1',
    pants: null,
    rightShoe: null,
    leftShoe: null,
  },

  // All items
  items: mockItems,

  // Grid states
  grids: initialGrids,

  // Navigation state - separate paths for inventory (your stuff) vs world (ground/loot)
  inventoryFocusPath: ['backpack-1'], // Start focused on backpack
  worldFocusPath: ['ground'], // World panel shows ground by default

  // Selected/focused item (unified hover state across all panels)
  selectedItemId: 'glasses-1', // Start with Night Goggles focused

  // Focused empty slot (for showing empty slot details)
  focusedEmptySlot: null,

  // Ground grid collapsed state
  groundCollapsed: false,

  // Character condition stats
  conditions: {
    health: 85,
    hunger: 60,
    thirst: 45,
    temperature: 72,
    encumbrance: 35,
  },

  // Modal state
  actionModal: {
    isOpen: false,
    itemId: null,
    position: { x: 0, y: 0 },
    context: null, // 'equipment' | 'grid' | 'ground'
  },

  destinationPicker: {
    isOpen: false,
    action: null, // 'unequip' | 'move' | 'drop'
    itemId: null,
    buttonY: null, // Y position of the button that triggered it
  },

  // UI scale and container rect for coordinate transformation (set by Inventory component)
  uiScale: 1,
  containerRect: null, // { left, top } of the scaled container

  // Actions
  setUIScale: (scale, containerRect = null) => set({ uiScale: scale, containerRect }),

  setSelectedItem: (itemId) => set({ selectedItemId: itemId, focusedEmptySlot: null }),

  setFocusedEmptySlot: (slotType) => set({ focusedEmptySlot: slotType, selectedItemId: null }),

  clearFocusedEmptySlot: () => set({ focusedEmptySlot: null }),

  openActionModal: (itemId, position, context) => {
    const { uiScale, containerRect } = get();
    let adjustedPosition = position;

    // Transform viewport coordinates to scaled container coordinates
    if (containerRect && uiScale !== 1) {
      // 1. Get position relative to container's visual top-left
      const relX = position.x - containerRect.left;
      const relY = position.y - containerRect.top;
      // 2. Divide by scale to convert to container's unscaled coordinate system
      adjustedPosition = {
        x: relX / uiScale,
        y: relY / uiScale,
      };
    }

    set({
      actionModal: { isOpen: true, itemId, position: adjustedPosition, context },
      selectedItemId: itemId,
    });
  },

  closeActionModal: () => set({
    actionModal: { isOpen: false, itemId: null, position: { x: 0, y: 0 }, context: null },
  }),

  openDestinationPicker: (action, itemId, buttonY = null) => set({
    destinationPicker: { isOpen: true, action, itemId, buttonY },
  }),

  closeDestinationPicker: () => set({
    destinationPicker: { isOpen: false, action: null, itemId: null, buttonY: null },
  }),

  closeAllModals: () => set({
    actionModal: { isOpen: false, itemId: null, position: { x: 0, y: 0 }, context: null },
    destinationPicker: { isOpen: false, action: null, itemId: null, buttonY: null },
  }),

  // Navigate into a container - panel determines which focus path to use
  // panel: 'inventory' | 'world'
  navigateToContainer: (containerId, panel, fromEquipment = false) => {
    const { inventoryFocusPath, worldFocusPath, items } = get();
    const item = items[containerId];
    if (!item?.gridSize) return;

    const focusPath = panel === 'inventory' ? inventoryFocusPath : worldFocusPath;
    const pathKey = panel === 'inventory' ? 'inventoryFocusPath' : 'worldFocusPath';

    // Don't duplicate if already at end of path
    const lastInPath = focusPath[focusPath.length - 1];
    if (lastInPath === containerId) {
      return;
    }

    if (fromEquipment || panel === 'world') {
      // Opening from equipment slot or in world panel - reset path
      set({ [pathKey]: [containerId], selectedItemId: containerId });
    } else {
      // Opening from within a grid - append to path
      set({ [pathKey]: [...focusPath, containerId], selectedItemId: containerId });
    }
  },

  // Navigate back in breadcrumb - panel determines which focus path
  navigateBack: (index, panel) => {
    const { inventoryFocusPath, worldFocusPath } = get();
    const focusPath = panel === 'inventory' ? inventoryFocusPath : worldFocusPath;
    const pathKey = panel === 'inventory' ? 'inventoryFocusPath' : 'worldFocusPath';

    if (index < focusPath.length - 1) {
      const newPath = focusPath.slice(0, index + 1);
      const targetContainer = newPath[newPath.length - 1];
      set({ [pathKey]: newPath, selectedItemId: targetContainer });
    }
  },

  // Clear inventory focus path (used when unequipping viewed container)
  clearInventoryFocusPath: () => set({ inventoryFocusPath: [], selectedItemId: null }),

  // Focus on an equipment slot and open it in inventory panel if it's a container
  focusOnEquipmentSlot: (slotType) => {
    const { equipment, items } = get();
    const itemId = equipment[slotType];
    if (itemId) {
      const item = items[itemId];
      if (item?.gridSize) {
        set({ inventoryFocusPath: [itemId], selectedItemId: itemId });
      } else {
        set({ selectedItemId: itemId });
      }
    }
  },

  toggleGroundCollapsed: () => set((state) => ({ groundCollapsed: !state.groundCollapsed })),

  // Get current grid for inventory panel
  getInventoryGrid: () => {
    const { inventoryFocusPath, grids } = get();
    if (inventoryFocusPath.length === 0) return null;
    const currentContainerId = inventoryFocusPath[inventoryFocusPath.length - 1];
    return grids[currentContainerId] || null;
  },

  // Get current grid for world panel
  getWorldGrid: () => {
    const { worldFocusPath, grids } = get();
    if (worldFocusPath.length === 0) return null;
    const currentContainerId = worldFocusPath[worldFocusPath.length - 1];
    return grids[currentContainerId] || null;
  },

  // Legacy - kept for compatibility, returns inventory grid
  getCurrentGrid: () => {
    return get().getInventoryGrid();
  },

  getGroundGrid: () => {
    const { grids } = get();
    return grids['ground'];
  },

  rotateItem: (itemId) => {
    set((state) => ({
      items: {
        ...state.items,
        [itemId]: {
          ...state.items[itemId],
          rotation: ((state.items[itemId].rotation + 90) % 360),
        },
      },
    }));
  },

  // Get unique item at a grid position (handles multi-cell items)
  getItemAtPosition: (gridId, x, y) => {
    const { grids, items } = get();
    const grid = grids[gridId];
    if (!grid || y >= grid.height || x >= grid.width) return null;
    const itemId = grid.cells[y][x];
    return itemId ? items[itemId] : null;
  },

  // Find the origin position of an item in a grid
  findItemOrigin: (gridId, itemId) => {
    const { grids } = get();
    const grid = grids[gridId];
    if (!grid) return null;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.cells[y][x] === itemId) {
          return { x, y };
        }
      }
    }
    return null;
  },

  // Find a free position in a grid that can fit an item
  findFreePosition: (gridId, itemWidth, itemHeight) => {
    const { grids } = get();
    const grid = grids[gridId];
    if (!grid) return null;

    for (let y = 0; y <= grid.height - itemHeight; y++) {
      for (let x = 0; x <= grid.width - itemWidth; x++) {
        let canPlace = true;
        for (let dy = 0; dy < itemHeight && canPlace; dy++) {
          for (let dx = 0; dx < itemWidth && canPlace; dx++) {
            if (grid.cells[y + dy][x + dx] !== null) {
              canPlace = false;
            }
          }
        }
        if (canPlace) {
          return { x, y };
        }
      }
    }
    return null;
  },

  // Unequip an item from equipment to a container/ground
  unequipItem: (itemId, targetGridId) => {
    const { equipment, items, grids, inventoryFocusPath } = get();
    const item = items[itemId];
    if (!item) return false;

    // Find which equipment slot has this item
    let equipmentSlot = null;
    for (const [slot, equippedId] of Object.entries(equipment)) {
      if (equippedId === itemId) {
        equipmentSlot = slot;
        break;
      }
    }
    if (!equipmentSlot) return false;

    // Find free position in target grid
    const targetGrid = grids[targetGridId];
    if (!targetGrid) return false;

    const freePos = get().findFreePosition(targetGridId, item.size.width, item.size.height);
    if (!freePos) return false;

    // Check if the item being unequipped is in the inventory focus path
    // If so, we need to clear the path (close the view)
    const shouldClearPath = inventoryFocusPath.includes(itemId);

    // Update state
    set((state) => {
      // Create new grid cells with item placed
      const newCells = state.grids[targetGridId].cells.map(row => [...row]);
      for (let dy = 0; dy < item.size.height; dy++) {
        for (let dx = 0; dx < item.size.width; dx++) {
          newCells[freePos.y + dy][freePos.x + dx] = itemId;
        }
      }

      return {
        equipment: {
          ...state.equipment,
          [equipmentSlot]: null,
        },
        grids: {
          ...state.grids,
          [targetGridId]: {
            ...state.grids[targetGridId],
            cells: newCells,
          },
        },
        // Clear inventory focus path if unequipping viewed container
        inventoryFocusPath: shouldClearPath ? [] : state.inventoryFocusPath,
        selectedItemId: null,
      };
    });

    return true;
  },

  // Equip an item from a grid to an equipment slot
  equipItem: (itemId, targetSlot = null) => {
    const { equipment, items, grids } = get();
    const item = items[itemId];
    if (!item) return false;

    // Check if item can be equipped
    if (!item.equippableSlots || item.equippableSlots.length === 0) return false;

    // Determine which slot to equip to
    let slot = targetSlot;
    if (!slot) {
      // Find first available slot from equippableSlots
      for (const possibleSlot of item.equippableSlots) {
        if (equipment[possibleSlot] === null) {
          slot = possibleSlot;
          break;
        }
      }
    }

    // If no slot available, use the first equippable slot (will replace existing)
    if (!slot) {
      slot = item.equippableSlots[0];
    }

    // Verify this slot is valid for the item
    if (!item.equippableSlots.includes(slot)) return false;

    // Find which grid contains this item and remove it
    let sourceGridId = null;
    let itemPositions = [];

    for (const [gridId, grid] of Object.entries(grids)) {
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          if (grid.cells[y][x] === itemId) {
            sourceGridId = gridId;
            itemPositions.push({ x, y });
          }
        }
      }
      if (sourceGridId) break;
    }

    if (!sourceGridId) return false;

    // Update state
    set((state) => {
      // Remove item from source grid
      const newCells = state.grids[sourceGridId].cells.map(row => [...row]);
      for (const pos of itemPositions) {
        newCells[pos.y][pos.x] = null;
      }

      return {
        equipment: {
          ...state.equipment,
          [slot]: itemId,
        },
        grids: {
          ...state.grids,
          [sourceGridId]: {
            ...state.grids[sourceGridId],
            cells: newCells,
          },
        },
        selectedItemId: itemId,
      };
    });

    return true;
  },
}));
