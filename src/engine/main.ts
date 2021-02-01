import { CanvasManager } from "./logic/CanvasManager";
import { EsceneManager } from "./logic/EsceneManager";
import { Player } from "./logic/Player";
import { KeyboardManager } from "./logic/KeyboardManager";
import { RenderCanvasManager } from "./Render/RenderCanvasManager";

export function main() {
  let levelNumber: number = 1;
  const FOV = 60;
  const fps = 60;

  const canvas = new CanvasManager();
  const canvasR = new RenderCanvasManager();
  const escene = new EsceneManager(levelNumber);
  const player = new Player(escene, 75, 75, FOV);

  new KeyboardManager(player);

  canvas.init();
  canvasR.init();

  setInterval(() => {
    canvas.clearCanvas();
    canvasR.clearCanvas();
    escene.draw();
    player.draw();
  }, 1000 / fps);
}
