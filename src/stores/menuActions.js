// Transform viewport coordinates to scaled container coordinates
function adjustModalPosition(position, uiScale, containerRect) {
  if (!containerRect || uiScale === 1) return position;
  const relX = position.x - containerRect.left;
  const relY = position.y - containerRect.top;
  return { x: relX / uiScale, y: relY / uiScale };
}

export const initialMenu = {
  isOpen: false,
  itemId: null,
  position: { x: 0, y: 0 },
  source: null, // 'equipment' | 'grid' | 'ground' | 'world'
  path: [],     // Navigation path for submenus
  focusIndex: 0,
};

export function createMenuActions(get, set) {
  return {
    openMenu: (itemId, position, source) => {
      const { uiScale, containerRect } = get();
      const adjustedPosition = adjustModalPosition(position, uiScale, containerRect);
      set({
        menu: { isOpen: true, itemId, position: adjustedPosition, source, path: [], focusIndex: 0 },
        selectedItemId: itemId,
      });
    },

    closeMenu: () => set({ menu: initialMenu }),

    menuNavigateTo: (segment) => set((state) => ({
      menu: { ...state.menu, path: [...state.menu.path, segment], focusIndex: 0 },
    })),

    menuNavigateBack: () => set((state) => ({
      menu: { ...state.menu, path: state.menu.path.slice(0, -1), focusIndex: 0 },
    })),

    // Navigate to a specific depth level (0 = root, 1 = first submenu, etc.)
    menuNavigateToLevel: (level, focusIndex = 0) => set((state) => ({
      menu: { ...state.menu, path: state.menu.path.slice(0, level), focusIndex },
    })),

    menuSetFocusIndex: (index) => set((state) => ({
      menu: { ...state.menu, focusIndex: index },
    })),
  };
}
