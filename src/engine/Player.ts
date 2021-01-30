import { CanvasManager } from "./CanvasManager";
import { EsceneManager } from "./EsceneManager";

export class Player {
  private ctx: CanvasRenderingContext2D = new CanvasManager().getContext();
  private escene: EsceneManager;

  private colorPlayer: string = "#7D07F2";

  private coorX: number;
  private coorY: number;

  private move: number = 0; // 0 = still, 1 = front, -1 = back
  private turn: number = 0; // 0 = still, 1 = right, -1 = left
  private rotationAngle: number = 0;

  private moveSpeed: number = 3; // Pixels
  private turnSpeed: number = 3 * (Math.PI / 180); // Degree

  constructor(escene: EsceneManager, x: number, y: number) {
    this.escene = escene;
    this.coorX = x;
    this.coorY = y;
  }

  up(): void {
    this.move = 1;
  }

  down(): void {
    this.move = -1;
  }

  left(): void {
    this.turn = -1;
  }

  right(): void {
    this.turn = 1;
  }

  moveUnpress(): void {
    this.move = 0;
  }

  turnUnpress(): void {
    this.turn = 0;
  }

  angleNormalization(angle: number): number {
    angle %= 2 * Math.PI;

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  collision(x: number, y: number): boolean {
    let collide: boolean = false;

    // Find out in which tile the player is
    let tileX = Math.trunc(x / this.escene.getTileWidth());
    let tileY = Math.trunc(y / this.escene.getTileHeight());

    if (this.escene.collision(tileX, tileY)) collide = true;

    return collide;
  }

  update(): void {
    // Move
    let newX =
      this.coorX + this.move * Math.cos(this.rotationAngle) * this.moveSpeed;
    let newY =
      this.coorY + this.move * Math.sin(this.rotationAngle) * this.moveSpeed;

    if (!this.collision(newX, newY)) {
      this.coorY = newY;
      this.coorX = newX;
    }

    // Turn
    this.rotationAngle += this.turn * this.turnSpeed;
    this.rotationAngle = this.angleNormalization(this.rotationAngle);
  }

  draw(): void {
    this.update();

    // Draw Player
    this.ctx.fillStyle = this.colorPlayer;
    this.ctx.fillRect(this.coorX - 3, this.coorY - 3, 6, 6);

    // Direction line
    let xDestiny = this.coorX + Math.cos(this.rotationAngle) * 40;
    let yDestiny = this.coorY + Math.sin(this.rotationAngle) * 40;

    this.ctx.beginPath();
    this.ctx.moveTo(this.coorX, this.coorY);
    this.ctx.lineTo(xDestiny, yDestiny);
    this.ctx.strokeStyle = this.colorPlayer;
    this.ctx.stroke();
  }
}
