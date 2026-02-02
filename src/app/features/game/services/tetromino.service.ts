import { Injectable } from '@angular/core';
import { TetrominoType } from '../../../core/enums/tetromino-type.enum';
import { Tetromino } from '../../../core/models/tetromino.model';
import { TETROMINO_SHAPE_MAP } from '../../../core/constants/tetromino-shapes.constants';

@Injectable({
  providedIn: 'root',
})
export class TetrominoService {
  private readonly shapes = TETROMINO_SHAPE_MAP;

  getRandomTetrominoType(): TetrominoType {
    const types = Object.values(TetrominoType);
    return types[Math.floor(Math.random() * types.length)];
  }

  getShape(type: TetrominoType): number[][] {
    return this.shapes[type].map((row: number[]) => [...row]);
  }

  createTetromino(type: TetrominoType, x: number, y: number): Tetromino {
    return new Tetromino(type, { x, y });
  }
}
