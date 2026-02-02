import { TetrominoType } from '../enums/tetromino-type.enum';

export type Shape = number[][];

//Cell value shape
export const SHAPE_EMPTY = 0;
export const SHAPE_FILLED = 1;

//I shape
export const I_SHAPE: Shape = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

//O shape
export const O_SHAPE: Shape = [
  [1, 1],
  [1, 1],
];

//T shape
export const T_SHAPE: Shape = [
  [0, 1, 0],
  [1, 1, 1],
];

//L shape
export const L_SHAPE: Shape = [
  [0, 0, 1],
  [1, 1, 1],
];

//j shape
export const J_SHAPE: Shape = [
  [1, 0, 0],
  [1, 1, 1],
];

//S shape
export const S_SHAPE: Shape = [
  [0, 1, 1],
  [1, 1, 0],
];

//Z shape
export const Z_SHAPE: Shape = [
  [1, 1, 0],
  [0, 1, 1],
];

export const TETROMINO_SHAPE_MAP: Record<TetrominoType, Shape> = {
  [TetrominoType.I]: I_SHAPE,
  [TetrominoType.O]: O_SHAPE,
  [TetrominoType.T]: T_SHAPE,
  [TetrominoType.L]: L_SHAPE,
  [TetrominoType.J]: J_SHAPE,
  [TetrominoType.S]: S_SHAPE,
  [TetrominoType.Z]: Z_SHAPE,
};
