import { ECS } from "./ecs/ecs";
import { PointComponent } from "./ecs/components/point";

export const keys = {
  ARROW_UP: "ARROW_UP",
  ARROW_DOWN: "ARROW_DOWN",
  ARROW_LEFT: "ARROW_LEFT",
  ARROW_RIGHT: "ARROW_RIGHT",
};

export interface SystemEvent {
  mouse: {
    mousemove: PointComponent;
  };
  keyboard: {
    keys: (keyof typeof keys)[];
  };
}

export interface Renderer {
  assets: Record<string, { size: PointComponent }>;
  assetsLoaded: boolean;
  clear: () => void;
  addImages(images: { id: string; filePath: string }[]): Promise<void>;
  drawShape: (points: PointComponent[], border?: string, fill?: string) => void;
  drawImage(options: {
    id: string;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
  }): void;
}

export interface Platform {
  viewport: PointComponent;
  cancelFrame: (frameId: number) => void;
  requestFrame: (cb: (timestamp: number) => void) => number;
  events: SystemEvent;
  renderer: Renderer;
}

export abstract class Scene {
  public ecs!: ECS;
  public init?(): void;
}

// Game loop based on: https://github.com/IceCreamYou/MainLoop.js/blob/gh-pages/src/mainloop.js
export class GameEngine {
  private fps = 60;
  private simulationTimestep = 1000 / this.fps;
  private frameDelta = 0;
  private lastFrameTimeMs = 0;
  private started = false;
  private frameId = 0;

  public running = false;
  public scene!: Scene;

  constructor(public platform: Platform) {}

  private loop(timestamp: number) {
    this.frameId = this.platform.requestFrame((timestamp) => {
      this.loop(timestamp);
    });

    if (!this.platform.renderer.assetsLoaded) return;

    // calculate the delta or elapsed time since the last frame
    this.frameDelta += timestamp - this.lastFrameTimeMs;
    this.lastFrameTimeMs = timestamp;

    if (this.frameDelta > 1000) {
      this.frameDelta = this.simulationTimestep;
    }

    // handle any input
    this.scene.ecs.input?.(this.platform.events);

    // perform an update if the lag counter exceeds or is equal to
    // the frame duration.
    // this means we are updating at a Fixed time-step.
    while (this.frameDelta >= this.simulationTimestep) {
      this.scene.ecs.update?.(timestamp);
      this.frameDelta -= this.simulationTimestep;
    }

    // calculate the lag offset, this tells us how far we are
    // into the next frame
    const lagOffset = this.frameDelta / this.simulationTimestep;

    // render the frame passing in the lag offset to interpolate positions
    this.platform.renderer.clear();
    this.scene.ecs.render?.(this.platform.renderer, lagOffset);
  }

  public start() {
    if (this.started) return;

    this.started = true;

    this.frameId = this.platform.requestFrame(() => {
      this.running = true;

      this.frameId = this.platform.requestFrame((timestamp) => {
        this.loop(timestamp);
      });
    });
  }

  public stop() {
    this.running = false;
    this.started = false;
    this.platform.cancelFrame(this.frameId);
  }

  public setScene(scene: Scene) {
    scene.ecs = new ECS(this);
    this.scene = scene;
    this.scene.init?.();
    this.scene.ecs.init();
  }
}
