import {
  Platform,
  KEYS,
  Renderer,
  RendererDrawImage,
  RendererDrawText,
  RendererDrawShape,
  RendererMeasureText,
  SystemEvent,
} from "..";
import { PointComponent, SizeComponent } from "../ecs/components";

const ERRORS = {
  imageMissing: (id: string) =>
    `Image with id \`${id}\` not found. Call \`addImage()\` before attempting to draw.`,
};

const SCALE = 2;

const KEY_MAPPING: { [key: KeyboardEvent["key"]]: keyof typeof KEYS } = {
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
    image-rendering: pixelated;
    -webkit-font-smoothing : none;
  }
`;

const DRAW_DEFAULTS = {
  border: "transparent",
  color: "#FFFFFF",
  fontFamily: "sans-serif",
  fontSize: 10,
  fontWeight: "normal",
  textAlign: "left",
} as const;

const ELEMENTS = {
  body: "body",
  canvas: "canvas",
  style: "style",
} as const;

const CANVAS_CONTEXT = "2d" as const;

class WebEventHandler {
  public events: SystemEvent = {
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

  private setEvents(events: Partial<SystemEvent> = {}) {
    this.events = structuredClone({ ...this.events, ...events });
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.getCanvas().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.setEvents({
      mouse: {
        mousemove: new PointComponent(x / SCALE, y / SCALE),
      },
    });
  }

  private handleKeydown(e: KeyboardEvent) {
    const key = KEY_MAPPING[e.key];

    if (!key) return;

    const currentKeys = this.events.keyboard.keys;

    this.setEvents({
      keyboard: {
        keys: currentKeys.includes(key) ? currentKeys : currentKeys.concat(key),
      },
    });
  }

  private handleKeyup(e: KeyboardEvent) {
    const key = KEY_MAPPING[e.key];

    if (!key) return;

    const currentKeys = this.events.keyboard.keys;

    this.setEvents({
      keyboard: {
        keys: currentKeys.filter((k) => k !== key),
      },
    });
  }

  private getCanvas(): HTMLCanvasElement {
    return document.querySelector(this.selector)!;
  }
}

class WebRenderer {
  private imageCache: Record<string, HTMLImageElement> = {};

  public images: Record<string, { size: PointComponent }> = {};
  public fontsLoaded = true;
  public imagesLoaded = false;

  constructor(public selector: string) {}

  public clear() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  public assetsLoaded() {
    return this.fontsLoaded && this.imagesLoaded;
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
    this.imagesLoaded = false;

    for (let i = 0; i < images.length; i++) {
      if (this.imageCache[images[i].id]) continue;

      const image = new Image();
      image.src = images[i].filePath;
      image.onload = () => {
        this.imageCache[images[i].id] = image;
        this.images[images[i].id] = {
          size: new PointComponent(image.width, image.height),
        };
        if (i === images.length - 1) this.imagesLoaded = true;
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
      console.error(ERRORS.imageMissing(id));
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

  public drawShape({
    points = [],
    border = DRAW_DEFAULTS.border,
    fill,
  }: RendererDrawShape) {
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
    color = DRAW_DEFAULTS.color,
    maxWidth = undefined,
    fontFamily = DRAW_DEFAULTS.fontFamily,
    fontSize = DRAW_DEFAULTS.fontSize,
    fontWeight = DRAW_DEFAULTS.fontWeight,
    textAlign = DRAW_DEFAULTS.textAlign,
  }: RendererDrawText) {
    const ctx = this.getContext();
    const m = this.measureText({ text, fontFamily, fontSize, fontWeight });

    ctx.font = this.getFont({ fontFamily, fontSize, fontWeight });
    ctx.textAlign = textAlign;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y + m.y, maxWidth);
  }

  public measureText({
    text,
    fontFamily = DRAW_DEFAULTS.fontFamily,
    fontSize = DRAW_DEFAULTS.fontSize,
    fontWeight = DRAW_DEFAULTS.fontWeight,
  }: RendererMeasureText) {
    const ctx = this.getContext();

    ctx.font = this.getFont({ fontFamily, fontSize, fontWeight });

    const m = ctx.measureText(text);

    return new SizeComponent(
      m.width,
      m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
    );
  }

  private getFont({
    fontFamily = DRAW_DEFAULTS.fontFamily,
    fontSize = DRAW_DEFAULTS.fontSize,
    fontWeight = DRAW_DEFAULTS.fontWeight,
  }: Pick<RendererMeasureText, "fontFamily" | "fontSize" | "fontWeight">) {
    return `${fontWeight} ${fontSize}px ${fontFamily}`;
  }

  private getCanvas(): HTMLCanvasElement {
    return document.querySelector(this.selector)!;
  }

  private getContext(): CanvasRenderingContext2D {
    const ctx = this.getCanvas().getContext(CANVAS_CONTEXT)!;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }
}

export class WebPlatform implements Platform {
  public events: SystemEvent;
  public renderer: Renderer;
  public viewport: PointComponent = new PointComponent(0, 0);

  private eventHandler: WebEventHandler;

  constructor() {
    // set document styles
    const style = document.createElement(ELEMENTS.style);
    style.textContent = CSS_RESET;
    document.head.appendChild(style);

    // craete canvas and set dimenstions
    const body = document.querySelector(ELEMENTS.body)!;
    const canvas = document.createElement(ELEMENTS.canvas);

    this.setCanvasSize(canvas);
    canvas.tabIndex = 1000;

    // attach canvas
    body.prepend(canvas);
    canvas.focus();

    // wire up input events
    this.eventHandler = new WebEventHandler(ELEMENTS.canvas);
    this.events = this.eventHandler.events;

    // proxy rendering
    this.renderer = new WebRenderer(ELEMENTS.canvas);

    // handle resize
    window.onresize = () => {
      this.setCanvasSize(canvas);
    };
  }

  private setCanvasSize(canvas: HTMLCanvasElement) {
    const body = document.querySelector(ELEMENTS.body)!;
    const context = canvas.getContext(CANVAS_CONTEXT)!;

    canvas.width = body.offsetWidth;
    canvas.height = body.offsetHeight;
    context.scale(SCALE, SCALE);

    this.viewport.x = body.offsetWidth / SCALE;
    this.viewport.y = body.offsetHeight / SCALE;
  }

  public requestFrame(cb: (timestamp: number) => void): number {
    this.events = this.eventHandler.events;
    return window.requestAnimationFrame(cb);
  }

  public cancelFrame(frameId: number): void {
    window.cancelAnimationFrame(frameId);
  }
}
