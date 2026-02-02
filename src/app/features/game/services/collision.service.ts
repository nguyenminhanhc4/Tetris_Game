import { Injectable } from '@angular/core';
import { Tetromino } from '../../../core/models/tetromino.model';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  private readonly WIDTH = 10;
  private readonly HEIGHT = 20;

  checkCollision(grid: number[][], tetromino: Tetromino, offsetX = 0, offsetY = 0): boolean {
    const { shape, position } = tetromino;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 0) continue;

        const newX = position.x + x + offsetX;
        const newY = position.y + y + offsetY;

        if (newX < 0 || newX >= this.WIDTH || newY >= this.HEIGHT) {
          return true;
        }

        if (newY >= 0 && grid[newY][newX] === 1) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveLeft(grid: number[][], tetromino: Tetromino): boolean {
    return !this.checkCollision(grid, tetromino, -1, 0);
  }

  canMoveRight(grid: number[][], tetromino: Tetromino): boolean {
    return !this.checkCollision(grid, tetromino, 1, 0);
  }

  canMoveDown(grid: number[][], tetromino: Tetromino): boolean {
    return !this.checkCollision(grid, tetromino, 0, 1);
  }

  canRotate(grid: number[][], tetromino: Tetromino): boolean {
    const rotatedTetromino = new Tetromino(tetromino.type, { ...tetromino.position });
    rotatedTetromino.rotateClockwise();
    return !this.checkCollision(grid, rotatedTetromino, 0, 0);
  }
}
