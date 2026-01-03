import type { MutableRefObject } from 'react';
import type {
  CellGrid,
  Equipment,
  GridCell,
  GridPosition,
  GridsMap,
  Item,
  ItemsMap,
  ItemType,
  PanelType,
  SlotType,
} from './inventory';
import type { NavigationDirection } from './gamepad';
import type {
  PanelRefs,
  Resolution,
  ItemPlacement,
  GamepadRefs,
  GamepadCallbacks,
  GridOccupancy,
} from './ui';

// Grid utility Props interfaces
export interface BuildGridWithItemsProps {
  width: number;
  height: number;
  items: ItemPlacement[];
}

export interface BuildGridWithItemsReturn {
  cells: CellGrid;
  instances: ItemsMap;
}

export interface CanPlaceAtProps {
  grid: CellGrid;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CheckIsOriginProps {
  grid: GridCell;
  itemId: string | null;
  col: number;
  row: number;
  renderedItems: Set<string>;
}

export interface FindFreePositionProps {
  grid: GridCell;
  itemWidth: number;
  itemHeight: number;
}

export interface FindItemInGridsProps {
  grids: GridsMap;
  itemId: string;
}

export interface FindItemOriginProps {
  grid: GridCell;
  itemId: string;
}

export interface GetCellValueProps {
  grid: GridCell;
  row: number;
  col: number;
}

export interface PlaceItemProps {
  grid: CellGrid;
  itemId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlaceItemInCellsProps {
  grid: CellGrid;
  itemId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PlaceItemInCellsReturn = CellGrid;

export interface RemoveItemFromCellsProps {
  cells: CellGrid;
  positions: GridPosition[];
}

export type RemoveItemFromCellsReturn = CellGrid;

export interface CreateEmptyGridProps {
  width: number;
  height: number;
}

export type CreateEmptyGridReturn = CellGrid;

// Inventory initialization
export interface BuildInitialInventoryReturn {
  grids: GridsMap;
  instances: ItemsMap;
  equipment: Equipment;
}

export interface CreateContainerGridsProps {
  instances: ItemsMap;
}

export type CreateContainerGridsReturn = GridsMap;

export interface CreateEquipmentInstancesReturn {
  instances: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
}

export interface InitialInventoryState {
  items: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
}

// Item utility Props interfaces
export interface CreateItemInstanceProps {
  template: Item;
  instanceId: string;
  quantity?: number;
}

export type CreateItemInstanceReturn = Item;

export interface BuildStatsLineProps {
  item: Item;
}

export interface CalculateItemDimensionsProps {
  item: Item;
  cellSize: number;
}

export interface CalculateItemDimensionsReturn {
  itemWidth: number;
  itemHeight: number;
}

export interface GetItemIconProps {
  type: ItemType;
}

// Position utility Props interfaces
export interface GetModalPositionProps {
  element: HTMLElement;
}

export interface GetModalPositionReturn {
  x: number;
  y: number;
}

// Hook Props interfaces
export interface UseCellSizeProps {
  resolution: Resolution;
}

export interface UseEquipmentSlotProps {
  slotType: SlotType;
}

export interface UsePanelNavigationProps {
  refs: PanelRefs;
  modalsOpen: boolean;
}

export interface UseBreadcrumbLinksContainerProps {
  panelLabel: string;
  focusPath: string[];
  items: ItemsMap;
  onNavigateBack: (index: number) => void;
  panelType: PanelType;
}

export interface UseBreadcrumbLinksInventoryProps {
  focusPath: string[];
  items: ItemsMap;
  navigateBack: (index: number, panel: string) => void;
}

// Gamepad utility Props interfaces
export interface ProcessGamepadProps {
  gamepad: Gamepad;
  refs: GamepadRefs;
  callbacks: GamepadCallbacks;
}

export interface CreateButtonHandlerProps {
  gamepad: Gamepad;
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

export type CreateButtonHandlerReturn = (
  buttonIndex: number,
  onPress: () => void,
  key?: string
) => void;

export interface HandleStickAxisProps {
  value: number;
  lastValue: number;
  posDir: NavigationDirection;
  negDir: NavigationDirection;
  posKey: string;
  negKey: string;
  onNavigate: ((dir: NavigationDirection) => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

// Random container contents
export interface GetRandomContainerContentsProps {
  width: number;
  height: number;
  minItems?: number;
  maxItems?: number;
}

export interface RandomIntProps {
  min: number;
  max: number;
}

export interface CheckGridSpotProps {
  grid: GridOccupancy;
  x: number;
  y: number;
  itemWidth: number;
  itemHeight: number;
}

export interface MarkGridOccupiedProps {
  grid: GridOccupancy;
  x: number;
  y: number;
  itemWidth: number;
  itemHeight: number;
}

export interface FindFreeGridSpotProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  itemWidth: number;
  itemHeight: number;
}

export interface CreateOccupancyGridProps {
  width: number;
  height: number;
}

export type CreateOccupancyGridReturn = GridOccupancy;

export interface PopulateContainerProps {
  width: number;
  height: number;
}

export interface PopulateContainerReturn {
  grid: {
    width: number;
    height: number;
    cells: CellGrid;
  };
  instances: ItemsMap;
  containerGrids: GridsMap;
}
