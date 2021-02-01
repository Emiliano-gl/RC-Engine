import { Player } from "./Player";

export class KeyboardManager {
  constructor(player: Player) {
    
    document.addEventListener("keydown", (key: KeyboardEvent) => {
      switch (key.key) {
        case "ArrowUp":
          player.up();
          break;

        case "ArrowDown":
          player.down();
          break;

        case "ArrowLeft":
          player.left();
          break;

        case "ArrowRight":
          player.right();
          break;
      }
    });

    document.addEventListener("keyup", (key: KeyboardEvent) => {
      switch (key.key) {
        case "ArrowUp":
          player.moveUnpress();
          break;

        case "ArrowDown":
          player.moveUnpress();
          break;

        case "ArrowLeft":
          player.turnUnpress();
          break;

        case "ArrowRight":
          player.turnUnpress();
          break;
      }
    })
  }
}