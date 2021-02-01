import { levelsData } from "./levels";

export class LevelsController {
  static levels: number[][][] = levelsData;

  static secureLevel: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  static getLevel(index: number): number[][] {
    if (this.levels.length != 0) {
      if (index > this.levels.length) {
        return this.levels[this.levels.length - 1];
      }

      if (index <= 0) {
        return this.levels[0];
      }

      return this.levels[index - 1];
    } else {
      return this.secureLevel;
    }
  }
}
