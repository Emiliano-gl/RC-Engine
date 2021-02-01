import { CanvasManager } from "./CanvasManager";
import { LevelsController } from "./LevelsData/LevelsController";

export class EsceneManager {
  private canvas: CanvasManager = new CanvasManager();
  private ctx: CanvasRenderingContext2D = this.canvas.getContext();

  private wallColor: string = "#2c2c2c";
  private floorColor: string = "#f5f5f5";

  private level: number[][];
  private levelWidth: number;
  private levelHeight: number;

  private tileWidth: number;
  private tileHeight: number;

  constructor(levelNumber: number) {
    this.level = LevelsController.getLevel(levelNumber);

    this.levelHeight = this.level.length;
    this.levelWidth = this.level[0].length;

    this.tileWidth = Math.trunc(this.canvas.getCanvasWidth() / this.levelWidth);
    this.tileHeight = Math.trunc(
      this.canvas.getCanvasHeight() / this.levelHeight
    );
  }

  getCurrentLevel(): number[][] {
    return this.level;
  }

  collision(x: number, y: number): boolean {
    let collide: boolean = false;

    if (this.level[y][x] != 0) collide = true;

    return collide;
  }

  getlevel(): number[][] {
    return this.level;
  }

  getLevelWidth(): number {
    return this.levelWidth;
  }

  getLevelHeight(): number {
    return this.levelHeight;
  }

  getTileWidth(): number {
    return this.tileWidth;
  }

  getTileHeight(): number {
    return this.tileHeight;
  }

  draw(): void {
    let color: string;

    for (let y = 0; y < this.levelHeight; y++) {
      for (let x = 0; x < this.levelWidth; x++) {
        if (this.level[y][x] == 1) {
          color = this.wallColor;
        } else {
          color = this.floorColor;
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(
          x * this.tileWidth,
          y * this.tileHeight,
          this.tileWidth,
          this.tileHeight
        );
      }
    }
  }
}
