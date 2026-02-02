import { Shape, TETROMINO_SHAPE_MAP } from './../constants/tetromino-shapes.constants';
import { TetrominoType } from '../enums/tetromino-type.enum';

export interface Position {
  x: number;
  y: number;
}

export class Tetromino {
  readonly type: TetrominoType;
  shape: Shape;
  position: Position;

  constructor(type: TetrominoType, position: Position) {
    this.type = type;
    this.shape = this.cloneShape(TETROMINO_SHAPE_MAP[type]);
    this.position = position;
  }

  static fromShape(type: TetrominoType, position: Position, shape: Shape): Tetromino {
    const tetromino = new Tetromino(type, position);
    tetromino.shape = tetromino.cloneShape(shape);
    return tetromino;
  }

  move(dx: number, dy: number): void {
    this.position = {
      x: this.position.x + dx,
      y: this.position.y + dy,
    };
  }

  rotateClockwise(): void {
    this.shape = this.rotateMatrix(this.shape);
  }

  private rotateMatrix(matrix: Shape): Shape {
    const height = matrix.length;
    const width = matrix[0].length;

    const rotated: Shape = Array.from({ length: width }, () => Array(height).fill(0));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        rotated[x][height - 1 - y] = matrix[y][x];
      }
    }

    return rotated;
  }

  private cloneShape(shape: Shape): Shape {
    return shape.map((row) => [...row]);
  }
}
