import type { CellGrid, GridsMap, ItemsMap } from './inventory';
import type { GridOccupancy, ItemPlacement } from './ui';

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

export interface TryPlaceItemProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  itemId: string;
  quantity: number;
}

export type TryPlaceItemReturn = ItemPlacement | null;

export interface FillContainerWithItemsProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  targetCount: number;
  excludeId?: string;
}

export interface PlaceGuaranteedStackableProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
}

export type PlaceGuaranteedStackableReturn = ItemPlacement | null;
