import { PointComponent } from "../game-engine";
import { PositionComponent } from "../game-engine/ecs/components/position";

type Direction = 0 | 1 | 2 | 3 | 4 | 5;

class Orientation {
  constructor(
    public f0: number,
    public f1: number,
    public f2: number,
    public f3: number,
    public b0: number,
    public b1: number,
    public b2: number,
    public b3: number,
    public startAngle: number
  ) {}
}

export class Hex {
  public static directions: Hex[] = [
    new Hex(1, 0, -1), // bottom right
    new Hex(1, -1, 0), // top right
    new Hex(0, -1, 1), // top
    new Hex(-1, 0, 1),
    new Hex(-1, 1, 0),
    new Hex(0, 1, -1), // bottom
  ];

  public static diagonals: Hex[] = [
    new Hex(2, -1, -1),
    new Hex(1, -2, 1),
    new Hex(-1, -1, 2),
    new Hex(-2, 1, 1),
    new Hex(-1, 2, -1),
    new Hex(1, 1, -2),
  ];

  constructor(public q: number, public r: number, public s: number) {
    if (Math.round(q + r + s) !== 0) throw new Error("x + y + z must be 0");
  }

  public equals(h: Hex): boolean {
    return this.q === h.q && this.r === h.r && this.s === h.s;
  }

  public add(h: Hex): Hex {
    return new Hex(this.q + h.q, this.r + h.r, this.s + h.s);
  }

  public subtract(h: Hex): Hex {
    return new Hex(this.q - h.q, this.r - h.r, this.s - h.s);
  }

  public multiply(h: Hex): Hex {
    return new Hex(this.q * h.q, this.r * h.r, this.s * h.s);
  }

  public scale(k: number): Hex {
    return new Hex(this.q * k, this.r * k, this.s * k);
  }

  public rotateLeft(): Hex {
    return new Hex(-this.s, -this.q, -this.r);
  }

  public rotateRight(): Hex {
    return new Hex(-this.r, -this.s, -this.q);
  }

  public length(h: Hex): number {
    return (Math.abs(h.q) + Math.abs(h.r) + Math.abs(h.s)) / 2;
  }

  public distance(h: Hex): number {
    return this.length(this.subtract(h));
  }

  public direction(d: Direction): Hex {
    return Hex.directions[d];
  }

  public neighbor(d: Direction): Hex {
    return this.add(this.direction(d));
  }

  public diagonalNeighbor(d: Direction): Hex {
    return this.add(Hex.diagonals[d]);
  }

  public round(): Hex {
    let qi: number = Math.round(this.q);
    let ri: number = Math.round(this.r);
    let si: number = Math.round(this.s);
    const q_diff: number = Math.abs(qi - this.q);
    const r_diff: number = Math.abs(ri - this.r);
    const s_diff: number = Math.abs(si - this.s);
    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si;
    } else if (r_diff > s_diff) {
      ri = -qi - si;
    } else {
      si = -qi - ri;
    }
    return new Hex(qi, ri, si);
  }

  public lerp(h: Hex, t: number): Hex {
    return new Hex(
      this.q * (1.0 - t) + h.q * t,
      this.r * (1.0 - t) + h.r * t,
      this.s * (1.0 - t) + h.s * t
    );
  }

  public linedraw(h: Hex): Hex[] {
    const n: number = this.distance(h);
    const aNudge: Hex = new Hex(this.q + 1e-6, this.r + 1e-6, this.s - 2e-6);
    const bNudge: Hex = new Hex(h.q + 1e-6, h.r + 1e-6, h.s - 2e-6);
    const results: Hex[] = [];
    const step: number = 1.0 / Math.max(n, 1);
    for (let i = 0; i <= n; i++) {
      results.push(aNudge.lerp(bNudge, step * i).round());
    }
    return results;
  }
}

export class Layout {
  public static pointy: Orientation = new Orientation(
    Math.sqrt(3.0),
    Math.sqrt(3.0) / 2.0,
    0.0,
    3.0 / 2.0,
    Math.sqrt(3.0) / 3.0,
    -1.0 / 3.0,
    0.0,
    2.0 / 3.0,
    0.5
  );
  public static flat: Orientation = new Orientation(
    3.0 / 2.0,
    0.0,
    Math.sqrt(3.0) / 2.0,
    Math.sqrt(3.0),
    2.0 / 3.0,
    0.0,
    -1.0 / 3.0,
    Math.sqrt(3.0) / 3.0,
    0.0
  );

  constructor(
    /**
     * The distance from the center to a corner. The x and y values can be
     * set independently to allow for stretched hexagons.
     */
    public circumradius: PointComponent,
    /**
     * The center point of the hexagon.
     */
    public origin: PointComponent,
    /**
     * Flat or pointy.
     */
    public orientation: Orientation = Layout.flat
  ) {}

  public toPoint(h: Hex): PointComponent {
    const M: Orientation = this.orientation;
    const size: PointComponent = this.circumradius;
    const origin: PointComponent = this.origin;
    const x: number = (M.f0 * h.q + M.f1 * h.r) * size.x;
    const y: number = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return new PointComponent(x + origin.x, y + origin.y);
  }

  public toHex(p: PointComponent): Hex {
    const M: Orientation = this.orientation;
    const size: PointComponent = this.circumradius;
    const origin: PointComponent = this.origin;
    const pt: PointComponent = new PointComponent(
      (p.x - origin.x) / size.x,
      (p.y - origin.y) / size.y
    );
    const q: number = Math.round(M.b0 * pt.x + M.b1 * pt.y);
    const r: number = Math.round(M.b2 * pt.x + M.b3 * pt.y);
    return new Hex(q, r, -q - r);
  }

  public cornerOffset(corner: number): PointComponent {
    const M: Orientation = this.orientation;
    const size: PointComponent = this.circumradius;
    const angle: number = (2.0 * Math.PI * (M.startAngle - corner)) / 6.0;
    return new PointComponent(
      size.x * Math.cos(angle),
      size.y * Math.sin(angle)
    );
  }

  public corners(h: Hex): PointComponent[] {
    const corners: PointComponent[] = [];
    const center: PointComponent = this.toPoint(h);
    for (let i = 0; i < 6; i++) {
      const offset: PointComponent = this.cornerOffset(i);
      corners.push(
        new PointComponent(center.x + offset.x, center.y + offset.y)
      );
    }
    return corners;
  }
}

export class HexGrid {
  public grid: Hex[] = [];
  public layout: Layout;
  public gridSize: PointComponent = new PointComponent(0, 0);
  public pointSize: PointComponent = new PointComponent(0, 0);

  constructor(
    public hexSize: PointComponent,
    public pointPadding: PointComponent = new PointComponent(0, 0),
    public orientation: Orientation = Layout.flat
  ) {
    this.layout = new Layout(
      orientation === Layout.flat
        ? new PointComponent(this.hexSize.x / 2, this.hexSize.y / Math.sqrt(3))
        : new PointComponent(this.hexSize.x / Math.sqrt(3), this.hexSize.y / 2),
      new PointComponent(
        hexSize.x / 2 + this.pointPadding.x / 2,
        hexSize.y / 2 + this.pointPadding.y / 2
      ),
      orientation
    );
  }

  public rectangle(size: PointComponent) {
    const oHex = new Hex(0, 0, 0);
    let xHex = new Hex(0, 0, 0);
    let yHex = new Hex(0, 0, 0);

    if (this.orientation === Layout.flat) {
      for (let q = 0; q < size.x; q++) {
        const offset = Math.floor(q / 2);

        for (let r = 0 - offset; r < size.y - offset; r++) {
          const s = -q - r;
          const hex = new Hex(q, r, s);

          if (q > xHex.q) xHex = hex;
          if (q >= yHex.q && r >= yHex.r) yHex = hex;

          this.grid.push(hex);
        }
      }
    } else {
      for (let r = 0; r <= size.y; r++) {
        const offset = Math.floor(r / 2.0);
        for (let q = 0 - offset; q <= size.x - offset; q++) {
          const s = -q - r;
          const hex = new Hex(q, r, s);

          if (q >= xHex.q && r >= xHex.r) xHex = hex;
          if (r > yHex.r) yHex = hex;

          this.grid.push(hex);
        }
      }
    }

    this.gridSize = size;

    const oHexPoint = this.layout.toPoint(oHex);
    const xHexPoint = this.layout.toPoint(xHex);
    const yHexPoint = this.layout.toPoint(yHex);

    this.pointSize = new PointComponent(
      xHexPoint.x - oHexPoint.x + this.hexSize.x + this.pointPadding.x,
      yHexPoint.y - oHexPoint.y + this.hexSize.y + this.pointPadding.y
    );

    return this.grid;
  }

  public toIndex(hex: Hex) {
    const columnStart = 0 - Math.floor(hex.q / 2);
    if (hex.q < 0) return -1;
    if (hex.r < columnStart) return -1;
    if (hex.r >= columnStart + this.gridSize.y) return -1;
    return hex.q * this.gridSize.y + (hex.r - columnStart);
  }

  public hexesInArea(origin: PointComponent, width: number, height: number) {
    origin.x -= this.hexSize.x;
    origin.y -= this.hexSize.y;

    const startHex = this.layout.toHex(origin);
    const columns = (width / this.hexSize.x) * 1.5 + 2;
    const rows = height / this.hexSize.y + 2;

    let columnHexes = [startHex];
    const hexes: number[] = [];

    const addHex = (h: Hex) => {
      const i = this.toIndex(h);
      const mh = this.grid[i];
      if (mh) hexes.push(i);
    };

    for (let i = 0; i < columns; i++) {
      const direction = i % 2 === 0 ? 1 : 0;
      const hex = columnHexes[i];
      columnHexes.push(hex.neighbor(direction));
    }

    for (let i = 0; i < columnHexes.length; i++) {
      let hex = columnHexes[i];
      addHex(hex);

      for (let j = 0; j < rows; j++) {
        hex = hex.neighbor(5);
        addHex(hex);
      }
    }

    return hexes;
  }

  public setOrigin(origin: PositionComponent) {
    this.layout.origin.x = origin.x + this.pointPadding.x / 2;
    this.layout.origin.y = origin.y + this.pointPadding.y / 2;
  }
}
