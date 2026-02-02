import { Component } from '@angular/core';
import { Tetromino } from './tetromino.model';
import { TetrominoType } from '../enums/tetromino-type.enum';
import { T_SHAPE, O_SHAPE } from '../constants/tetromino-shapes.constants';

describe('Tetromino Rotation', () => {
  it('should rotate T shape clockwise correctly', () => {
    const tetromino = new Tetromino(TetrominoType.T, { x: 0, y: 0 });

    tetromino.rotateClockwise();

    expect(tetromino.shape).toEqual([
      [1, 0],
      [1, 1],
      [1, 0],
    ]);
  });

  it('should return to original shape after 4 rotations', () => {
    const tetromino = new Tetromino(TetrominoType.T, { x: 0, y: 0 });
    const originalShape = tetromino.shape.map((row) => [...row]);

    tetromino.rotateClockwise();
    tetromino.rotateClockwise();
    tetromino.rotateClockwise();
    tetromino.rotateClockwise();

    expect(tetromino.shape).toEqual(originalShape);
  });

  it('should not mutate original constant shape', () => {
    const tetromino = new Tetromino(TetrominoType.T, { x: 0, y: 0 });

    tetromino.rotateClockwise();

    expect(T_SHAPE).toEqual([
      [0, 1, 0],
      [1, 1, 1],
    ]);
  });

  it('O shape should remain unchanged after rotation', () => {
    const tetromino = new Tetromino(TetrominoType.O, { x: 0, y: 0 });

    tetromino.rotateClockwise();

    expect(tetromino.shape).toEqual(O_SHAPE);
  });
});
