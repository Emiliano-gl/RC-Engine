import { CanvasManager } from "./CanvasManager";
import { EsceneManager } from "./EsceneManager";

export class Ray {
  private canvas: CanvasManager = new CanvasManager();
  private ctx: CanvasRenderingContext2D = this.canvas.getContext();
  private escene: EsceneManager;

  private coorX: number;
  private coorY: number;

  private xIntercept!: number;
  private yIntercept!: number;

  private yStep!: number;
  private xStep!: number;

  private wallHitX: number = 0;
  private wallHitY: number = 0;

  private wallHitXHorizontal: number = 0;
  private wallHitYHorizontal: number = 0;
  private wallHitXVertical: number = 0;
  private wallHitYVertical: number = 0;

  private playerAngle: number;
  private increment: number;

  private down!: boolean;
  private left!: boolean;

  private column?: number;

  constructor(
    escene: EsceneManager,
    x: number,
    y: number,
    playerAngle: number,
    increment: number,
    column?: number
  ) {
    this.escene = escene;
    this.coorX = x;
    this.coorY = y;
    this.playerAngle = playerAngle;
    this.increment = increment;
    this.column = column;

    this.cast();
  }

  angleNormalization(angle: number): number {
    angle %= 2 * Math.PI;

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  setAngle(angle: number): void {
    this.playerAngle = this.angleNormalization(angle + this.increment);
  }

  setCoors(x: number, y: number): void {
    this.coorX = x;
    this.coorY = y;
  }

  distanceBetweenPoints(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  cast(): void {
    this.xIntercept = 0;
    this.yIntercept = 0;

    let tileSize: number;

    // Direccion of the ray
    this.down = false;
    this.left = false;

    if (this.playerAngle > 0 && this.playerAngle < Math.PI) this.down = true;

    if (this.playerAngle > Math.PI / 2 && this.playerAngle < (3 * Math.PI) / 2)
      this.left = true;

    // ------------------------------------------------------------

    // Horizontal collide

    let horizontalCollide: boolean = false;

    // Tilesize = tile height
    tileSize = this.escene.getTileHeight();

    // Find first intersection
    this.yIntercept = Math.floor(this.coorY / tileSize) * tileSize;

    // If the player look down
    if (this.down) this.yIntercept += tileSize;

    let adjacent: number =
      (this.yIntercept - this.coorY) / Math.tan(this.playerAngle);
    this.xIntercept = this.coorX + adjacent;

    // Calculate step distance
    this.yStep = tileSize;
    this.xStep = this.yStep / Math.tan(this.playerAngle);

    // If the player look up, y is reversed
    if (!this.down) this.yStep *= -1;

    // Check if x step is correct
    if ((this.left && this.xStep > 0) || (!this.left && this.xStep < 0))
      this.xStep *= -1;

    let nextXHorizontal: number = this.xIntercept;
    let nextYHorizontal: number = this.yIntercept;

    // If the player look up, delete one pixel to force the collide
    if (!this.down) nextYHorizontal -= 1;

    // Loop to find the collide point
    while (!horizontalCollide) {
      // Get the tile (round to floor)
      let tileX: number = Math.trunc(nextXHorizontal / tileSize);
      let tileY: number = Math.trunc(nextYHorizontal / tileSize);

      if (this.escene.collision(tileX, tileY)) {
        horizontalCollide = true;
        this.wallHitXHorizontal = nextXHorizontal;
        this.wallHitYHorizontal = nextYHorizontal;
      } else {
        nextXHorizontal += this.xStep;
        nextYHorizontal += this.yStep;
      }
    }

    // ------------------------------------------------------------

    // Vertical Collide

    let verticalCollide: boolean = false;

    // Tilesize = tile width
    tileSize = this.escene.getTileWidth();

    // Find first intersection
    this.xIntercept = Math.floor(this.coorX / tileSize) * tileSize;

    // If the player look right
    if (!this.left) this.xIntercept += tileSize;

    // The adjacent leg is added
    let opposite = (this.xIntercept - this.coorX) * Math.tan(this.playerAngle);
    this.yIntercept = this.coorY + opposite;

    // Calculate step distance
    this.xStep = tileSize;

    // If the player look left, y is reversed
    if (this.left) this.xStep *= -1;

    this.yStep = tileSize * Math.tan(this.playerAngle);

    // Check if y step is correct
    if ((!this.down && this.yStep > 0) || (this.down && this.yStep < 0))
      this.yStep *= -1;

    let nextXVertical: number = this.xIntercept;
    let nextYVertical: number = this.yIntercept;

    if (this.left) nextXVertical -= 1;

    // Loop to find the collide point
    while (
      !verticalCollide &&
      nextXVertical >= 0 &&
      nextYVertical >= 0 &&
      nextXVertical < this.canvas.getCanvasWidth() &&
      nextYVertical < this.canvas.getCanvasHeight()
    ) {
      // Get the tile (round to floor)
      let tileX: number = Math.trunc(nextXVertical / tileSize);
      let tileY: number = Math.trunc(nextYVertical / tileSize);

      if (this.escene.collision(tileX, tileY)) {
        verticalCollide = true;
        this.wallHitXVertical = nextXVertical;
        this.wallHitYVertical = nextYVertical;
      } else {
        nextXVertical += this.xStep;
        nextYVertical += this.yStep;
      }
    }

    // ------------------------------------------------------------

    let horizontalDistance = 9999;
    let verticalDistance = 9999;

    if (horizontalCollide) {
      horizontalDistance = this.distanceBetweenPoints(
        this.coorX,
        this.coorY,
        this.wallHitXHorizontal,
        this.wallHitYHorizontal
      );
    }

    if (verticalCollide) {
      verticalDistance = this.distanceBetweenPoints(
        this.coorX,
        this.coorY,
        this.wallHitXVertical,
        this.wallHitYVertical
      );
    }

    if (horizontalDistance < verticalDistance) {
      this.wallHitX = this.wallHitXHorizontal;
      this.wallHitY = this.wallHitYHorizontal;
    } else {
      this.wallHitX = this.wallHitXVertical;
      this.wallHitY = this.wallHitYVertical;
    }
  }

  draw(): void {
    this.cast();

    // Show ray line
    let xDestiny = this.wallHitX;
    let yDestiny = this.wallHitY;

    this.ctx.beginPath();
    this.ctx.moveTo(this.coorX, this.coorY);
    this.ctx.lineTo(xDestiny, yDestiny);
    this.ctx.strokeStyle = "#40FF96";
    this.ctx.stroke();
  }
}
