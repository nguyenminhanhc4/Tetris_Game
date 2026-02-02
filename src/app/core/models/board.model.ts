import { ROWS, COLS, EMPTY_CELL, FILLED_CELL } from '../constants/game.constants';
import { Tetromino } from './tetromino.model';

export class Board {
  readonly width = COLS;
  readonly height = ROWS;
  grid: number[][];

  constructor() {
    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid(): number[][] {
    return Array.from({ length: this.height }, () => Array(this.width).fill(EMPTY_CELL));
  }

  canPlace(tetromino: Tetromino): boolean {
    const { shape, position } = tetromino;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 0) continue;

        const boardX = position.x + x;
        const boardY = position.y + y;

        // Out of bounds
        if (boardX < 0 || boardX >= this.width || boardY < 0 || boardY >= this.height) {
          return false;
        }

        // Collision
        if (this.grid[boardY][boardX] === FILLED_CELL) {
          return false;
        }
      }
    }

    return true;
  }

  merge(tetromino: Tetromino): void {
    const { shape, position } = tetromino;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          this.grid[position.y + y][position.x + x] = FILLED_CELL;
        }
      }
    }
  }

  clearFullLines(): number {
    let cleared = 0;

    this.grid = this.grid.filter((row) => {
      const isFull = row.every((cell) => cell === FILLED_CELL);
      if (isFull) cleared++;
      return !isFull;
    });

    while (this.grid.length < this.height) {
      this.grid.unshift(Array(this.width).fill(EMPTY_CELL));
    }

    return cleared;
  }

  isGameOver(): boolean {
    return this.grid[0].some((cell) => cell === FILLED_CELL);
  }
}
