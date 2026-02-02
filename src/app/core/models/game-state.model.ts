import { Board } from './board.model';
import { Tetromino } from './tetromino.model';
import { TetrominoType } from '../enums/tetromino-type.enum';
import { SPAWN_X, SPAWN_Y } from '../constants/game.constants';
import { Score } from './score.model';

export class GameState {
  readonly board: Board;
  current: Tetromino;
  next: Tetromino;
  score: Score;
  isGameOver = false;

  constructor() {
    this.board = new Board();
    this.score = new Score();

    this.current = this.spawnTetromino();
    this.next = this.spawnTetromino();
  }

  private spawnTetromino(): Tetromino {
    const type = this.randomType();
    return new Tetromino(type, {
      x: SPAWN_X,
      y: SPAWN_Y,
    });
  }

  private randomType(): TetrominoType {
    const values = Object.values(TetrominoType);
    return values[Math.floor(Math.random() * values.length)];
  }

  lockCurrent(): void {
    this.board.merge(this.current);

    const cleared = this.board.clearFullLines();
    this.score.addClearedLines(cleared);

    this.current = this.next;
    this.current.position = { x: SPAWN_X, y: SPAWN_Y };
    this.next = this.spawnTetromino();

    if (!this.board.canPlace(this.current)) {
      this.isGameOver = true;
    }
  }
}
