import { PointComponent } from "../game-engine";
export { SPRITES } from "./sprites";

export const HEX_W = 49.33;
export const HEX_H = 42;
export const HEX_SIZE = new PointComponent(HEX_W, HEX_H);
export const MAP_SIZE = new PointComponent(100, 100);
export const MAP_PADDING = new PointComponent(200, 200);
export const MAP_CONTROLS_ARROW_PAN_VELOCITY = 10;
export const CAMERA_SCALE = 1;
