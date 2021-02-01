import { CanvasManager } from "./CanvasManager";
import { EsceneManager } from "./EsceneManager";
import { Ray } from "./Ray";
import { Render } from '../Render/Render';

export class Player {
  private canvas: CanvasManager = new CanvasManager();
  private ctx: CanvasRenderingContext2D = this.canvas.getContext();
  private escene: EsceneManager;
  private render: Render;

  private raysNumber!: number;
  private rays: Ray[] = [];

  private FOV: number;

  private colorPlayer: string = "#7D07F2";

  private coorX: number;
  private coorY: number;

  private move: number = 0; // 0 = still, 1 = front, -1 = back
  private turn: number = 0; // 0 = still, 1 = right, -1 = left
  private rotationAngle: number = 0;

  private moveSpeed: number = 1.5; // Pixels
  private turnSpeed: number = 2.5 * (Math.PI / 180); // Degree

  constructor(escene: EsceneManager, x: number, y: number, fov: number) {
    this.escene = escene;
    this.render = new Render(fov);
    this.coorX = x;
    this.coorY = y;

    // Rays
    this.raysNumber = this.canvas.getCanvasWidth();

    // Calculate rays degrees
    this.FOV = fov;

    const halfFOV = this.FOV / 2;
    let angleIncrement = this.degreeToRadian(this.FOV / this.raysNumber);
    let initAngle = this.degreeToRadian(this.rotationAngle - halfFOV);
    let rayAngle = initAngle;

    for (let index = 0; index < this.raysNumber; index++) {
      this.rays[index] = new Ray(
        escene,
        this.coorX,
        this.coorY,
        this.rotationAngle,
        rayAngle,
        index
      );
      rayAngle += angleIncrement;
    }
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

  degreeToRadian(angle: number): number {
    angle *= Math.PI / 180;
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

    // Ray update
    for (let index = 0; index < this.raysNumber; index++) {
      this.rays[index].setAngle(this.rotationAngle);
      this.rays[index].setCoors(this.coorX, this.coorY);
    }
  }

  draw(): void {
    this.update();

    for (let index = 0; index < this.raysNumber; index++) {
      this.render.renderWall(this.rays[index]);
      this.rays[index].draw();
    }

    // Draw Player
    this.ctx.fillStyle = this.colorPlayer;
    this.ctx.fillRect(this.coorX - 3, this.coorY - 3, 6, 6);

    // Direction line
    let xDestiny = this.coorX + Math.cos(this.rotationAngle) * 20;
    let yDestiny = this.coorY + Math.sin(this.rotationAngle) * 20;

    this.ctx.beginPath();
    this.ctx.moveTo(this.coorX, this.coorY);
    this.ctx.lineTo(xDestiny, yDestiny);
    this.ctx.strokeStyle = this.colorPlayer;
    this.ctx.stroke();
  }
}
