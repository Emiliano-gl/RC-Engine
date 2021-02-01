import { RenderCanvasManager } from "./RenderCanvasManager";
import { Ray } from "../logic/Ray";

export class Render {
  private rcanvas: RenderCanvasManager = new RenderCanvasManager();
  private rctx: CanvasRenderingContext2D = this.rcanvas.getContext();

  private FOV: number;
  private halfFOV: number;

  constructor(fov: number) {
    this.FOV = fov;
    this.halfFOV = fov / 2;
  }

  renderWall(ray: Ray) {
    let tileHeight: number = this.rcanvas.getCanvasHeight();
    let halfCanvasWidth: number = this.rcanvas.getCanvasWidth() / 2;
    let rayDistance: number = ray.getDistance();
    let projectionDistance: number = halfCanvasWidth / Math.tan(this.halfFOV);

    let wallHeight: number = (tileHeight / rayDistance) * projectionDistance;

    // Calculate the begin and end of the line
    let y0: number = Math.trunc(tileHeight / 2) - Math.trunc(wallHeight / 2);
    let y1: number = y0 + wallHeight;
    let x: number = ray.getColumn();

    // Draw the column (line)
    this.rctx.beginPath();
    this.rctx.moveTo(x, y0);
    this.rctx.lineTo(x, y1);
    this.rctx.strokeStyle = "#e1e1e1";
    this.rctx.stroke();
  }
}
