import { CanvasManager } from "./CanvasManager";
import { EsceneManager } from "./EsceneManager";
import { Player } from "./Player";
import { KeyboardManager } from "./KeyboardManager";

export function main() {
  let levelNumber: number = 1;
  const fps = 60;

  const canvas = new CanvasManager();
  const escene = new EsceneManager(levelNumber);
  const player = new Player(escene, 75, 75);

  new KeyboardManager(player);

  canvas.init();

  setInterval(() => {
    canvas.clearCanvas();
    escene.draw();
    player.draw();
  }, 1000 / fps);
}
