import {
  Platform,
  keys,
  RendererDrawImage,
  RendererDrawText,
  RendererMeasureText,
} from "..";
import { PointComponent, SizeComponent } from "../ecs/components";

const keyMapping: { [key: KeyboardEvent["key"]]: keyof typeof keys } = {
  ArrowUp: "ARROW_UP",
  ArrowDown: "ARROW_DOWN",
  ArrowLeft: "ARROW_LEFT",
  ArrowRight: "ARROW_RIGHT",
  w: "W",
  a: "A",
  s: "S",
  d: "D",
};

const CSS_RESET = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    height: 100vh;
    margin: 0 auto;
    overflow: hidden;
  }

  canvas {
    display: block;
    font-smooth: never;
    -webkit-font-smoothing : none;
  }
`;

class WebEventHandler {
  public events: Platform["events"] = {
    mouse: {
      mousemove: new PointComponent(0, 0),
    },
    keyboard: {
      keys: [],
    },
  };

  constructor(public selector: string) {
    const canvas = this.getCanvas();

    canvas.onmousemove = (e) => this.handleMouseMove(e);
    canvas.onkeydown = (e) => this.handleKeydown(e);
    canvas.onkeyup = (e) => this.handleKeyup(e);
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.getCanvas().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.events.mouse.mousemove.x = x / devicePixelRatio;
    this.events.mouse.mousemove.y = y / devicePixelRatio;
  }

  private handleKeydown(e: KeyboardEvent) {
    const key = keyMapping[e.key];

    if (!key) return;

    const currentKeys = this.events.keyboard.keys;

    this.events.keyboard.keys = currentKeys.includes(key)
      ? currentKeys
      : currentKeys.concat(key);
  }

  private handleKeyup(e: KeyboardEvent) {
    const key = keyMapping[e.key];

    if (!key) return;

    const currentKeys = this.events.keyboard.keys;

    this.events.keyboard.keys = currentKeys.filter((k) => k !== key);
  }

  private getCanvas(): HTMLCanvasElement {
    return document.querySelector(this.selector)!;
  }
}

class WebRenderer {
  private imageCache: Record<string, HTMLImageElement> = {};

  public assets: Record<string, { size: PointComponent }> = {};
  public fontsLoaded = true;
  public assetsLoaded = false;

  constructor(public selector: string) {}

  public clear() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  public async addFonts(fonts: { name: string; src: string }[]) {
    this.fontsLoaded = false;

    for (let i = 0; i < fonts.length; i++) {
      const font = new FontFace(fonts[i].name, `url(${fonts[i].src})`);

      font.load().then((font) => {
        (document.fonts as any).add(font);
        if (i === fonts.length - 1) this.fontsLoaded = true;
      });
    }
  }

  public addImages(images: { id: string; filePath: string }[]) {
    this.assetsLoaded = false;

    for (let i = 0; i < images.length; i++) {
      if (this.imageCache[images[i].id]) continue;

      const image = new Image();
      image.src = images[i].filePath;
      image.onload = () => {
        this.imageCache[images[i].id] = image;
        this.assets[images[i].id] = {
          size: new PointComponent(image.width, image.height),
        };
        if (i === images.length - 1) this.assetsLoaded = true;
      };
    }
  }

  public drawImage({
    id,
    sx,
    sy,
    sw,
    sh,
    dx = 0,
    dy = 0,
    dw,
    dh,
    align,
  }: RendererDrawImage) {
    const image = this.imageCache[id];

    if (!image) {
      console.error(
        `Image with id \`${id}\` not found. Call \`addImage()\` before attempting to draw.`
      );
      return;
    }

    const ctx = this.getContext();

    const _sx = sx ?? 0;
    const _sy = sy ?? 0;
    const _sw = sw ?? image.width;
    const _sh = sh ?? image.height;
    const _dw = dw ?? _sw;
    const _dh = dh ?? _sh;
    const _dx = align === "center" ? Math.round((dx ?? 0) - _dw / 2) : dx;
    const _dy = align === "center" ? Math.round((dy ?? 0) - _dh / 2) : dy;

    ctx.drawImage(image, _sx, _sy, _sw, _sh, _dx, _dy, _dw, _dh);
  }

  public drawShape(
    points: PointComponent[],
    border: string = "transparent",
    fill?: string
  ) {
    const ctx = this.getContext();
    ctx.beginPath();
    ctx.strokeStyle = border;
    for (var i = 0; i < points.length; i++) {
      const p = points[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    if (fill) {
      ctx.save();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    }
  }

  public drawText({
    text,
    x,
    y,
    color = "#FFFFFF",
    maxWidth = undefined,
    fontFamily = "sans-serif",
    fontSize = 10,
    fontWeight = "normal",
    textAlign = "left",
  }: RendererDrawText) {
    const ctx = this.getContext();
    const m = this.measureText({ text, fontFamily, fontSize, fontWeight });

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    ctx.textAlign = textAlign;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y + m.y, maxWidth);
  }

  public measureText({
    text,
    fontFamily = "sans-serif",
    fontSize = 10,
    fontWeight = "normal",
  }: RendererMeasureText) {
    const ctx = this.getContext();

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const m = ctx.measureText(text);

    return new SizeComponent(
      m.width,
      m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
    );
  }

  private getCanvas(): HTMLCanvasElement {
    return document.querySelector(this.selector)!;
  }

  private getContext(): CanvasRenderingContext2D {
    const ctx = this.getCanvas().getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }
}

export class WebPlatform implements Platform {
  public events: Platform["events"];
  public renderer: Platform["renderer"];
  public viewport: PointComponent = new PointComponent(0, 0);

  constructor() {
    // set document styles
    const style = document.createElement("style");
    style.textContent = CSS_RESET;
    document.head.appendChild(style);

    // craete canvas and set dimenstions
    const body = document.querySelector("body")!;
    const canvas = document.createElement("canvas");

    this.setCanvasSize(canvas);
    canvas.tabIndex = 1000;

    // attach canvas
    body.prepend(canvas);
    canvas.focus();

    // wire up input events
    const eventHandler = new WebEventHandler("canvas");
    this.events = eventHandler.events;

    // proxy rendering
    this.renderer = new WebRenderer("canvas");

    // handle resize
    window.onresize = () => {
      this.setCanvasSize(canvas);
    };
  }

  private setCanvasSize(canvas: HTMLCanvasElement) {
    const body = document.querySelector("body")!;

    canvas.width = body.offsetWidth / devicePixelRatio;
    canvas.height = body.offsetHeight / devicePixelRatio;

    canvas.setAttribute(
      "style",
      `width: ${body.offsetWidth}px; height: ${body.offsetHeight}px; image-rendering: pixelated;`
    );

    this.viewport.x = body.offsetWidth / devicePixelRatio;
    this.viewport.y = body.offsetHeight / devicePixelRatio;
  }

  public requestFrame(cb: (timestamp: number) => void): number {
    return window.requestAnimationFrame(cb);
  }

  public cancelFrame(frameId: number): void {
    window.cancelAnimationFrame(frameId);
  }
}
