export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Dimensions in pixels
  private canvasWidth = 500;
  private canvasHeight = 500;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }

  getCanvasWidth(): number {
    return this.canvasWidth;
  }

  getCanvasHeight(): number {
    return this.canvasHeight;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  init(): void {
    // Set the canvas width and height
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
