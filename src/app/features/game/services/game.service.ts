import { Injectable, signal, computed, WritableSignal, inject } from '@angular/core';
import { Tetromino } from '../../../core/models/tetromino.model';
import { GameStatus } from '../../../core/enums/game-status.enum';
import { Direction } from '../../../core/enums/direction.enum';
import { SPAWN_X, SPAWN_Y } from '../../../core/constants/game.constants';
import { TetrominoType } from '../../../core/enums/tetromino-type.enum';
import { TetrominoService } from './tetromino.service';
import { CollisionService } from './collision.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private tetrominoService = inject(TetrominoService);
  private collisionService = inject(CollisionService);

  private grid: WritableSignal<number[][]>;
  private currentPiece: WritableSignal<Tetromino>;
  private nextPiece: WritableSignal<Tetromino>;
  private score: WritableSignal<number>;
  private lines: WritableSignal<number>;
  private level: WritableSignal<number>;
  private gameOver: WritableSignal<boolean>;

  readonly status = signal<GameStatus>(GameStatus.INIT);
  readonly board = computed(() => this.grid());
  readonly currentTetromino = computed(() => this.currentPiece());
  readonly nextTetromino = computed(() => this.nextPiece());
  readonly scoreValue = computed(() => this.score());
  readonly linesValue = computed(() => this.lines());
  readonly levelValue = computed(() => this.level());
  readonly isGameOver = computed(() => this.gameOver());

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentLines = 0;

  constructor() {
    this.grid = signal(this.createEmptyGrid());
    this.currentPiece = signal(this.createPiece());
    this.nextPiece = signal(this.createPiece());
    this.score = signal(0);
    this.lines = signal(0);
    this.level = signal(1);
    this.gameOver = signal(false);
  }

  private createEmptyGrid(): number[][] {
    return Array.from({ length: 20 }, () => Array(10).fill(0));
  }

  private createPiece(): Tetromino {
    const type = this.tetrominoService.getRandomTetrominoType();
    return new Tetromino(type, { x: SPAWN_X, y: SPAWN_Y });
  }

  startGame(): void {
    this.grid.set(this.createEmptyGrid());
    this.currentPiece.set(this.createPiece());
    this.nextPiece.set(this.createPiece());
    this.score.set(0);
    this.lines.set(0);
    this.level.set(1);
    this.gameOver.set(false);
    this.currentLines = 0;
    this.status.set(GameStatus.RUNNING);
    this.startInterval();
  }

  pauseGame(): void {
    if (this.status() === GameStatus.RUNNING) {
      this.status.set(GameStatus.PAUSED);
      this.stopInterval();
    }
  }

  resumeGame(): void {
    if (this.status() === GameStatus.PAUSED) {
      this.status.set(GameStatus.RUNNING);
      this.startInterval();
    }
  }

  resetGame(): void {
    this.stopInterval();
    this.grid.set(this.createEmptyGrid());
    this.currentPiece.set(this.createPiece());
    this.nextPiece.set(this.createPiece());
    this.score.set(0);
    this.lines.set(0);
    this.level.set(1);
    this.gameOver.set(false);
    this.status.set(GameStatus.INIT);
  }

  move(direction: Direction): void {
    if (this.status() !== GameStatus.RUNNING) return;

    const current = this.currentPiece();
    const grid = this.grid();

    switch (direction) {
      case Direction.LEFT:
        if (this.collisionService.canMoveLeft(grid, current)) {
          current.move(-1, 0);
          this.currentPiece.set(Tetromino.fromShape(current.type, { ...current.position }, current.shape));
        }
        break;
      case Direction.RIGHT:
        if (this.collisionService.canMoveRight(grid, current)) {
          current.move(1, 0);
          this.currentPiece.set(Tetromino.fromShape(current.type, { ...current.position }, current.shape));
        }
        break;
      case Direction.DOWN:
        this.moveDown();
        break;
    }
  }

  rotate(): void {
    if (this.status() !== GameStatus.RUNNING) return;

    const current = this.currentPiece();
    const grid = this.grid();

    const rotated = Tetromino.fromShape(current.type, { ...current.position }, current.shape);
    rotated.rotateClockwise();

    if (this.collisionService.canRotate(grid, rotated)) {
      this.currentPiece.set(rotated);
    }
  }

  hardDrop(): void {
    if (this.status() !== GameStatus.RUNNING) return;

    let current = this.currentPiece();
    const grid = this.grid();

    while (this.collisionService.canMoveDown(grid, current)) {
      current.move(0, 1);
    }

    this.currentPiece.set(Tetromino.fromShape(current.type, { ...current.position }, current.shape));
    this.lockTetromino();
  }

  private moveDown(): void {
    let current = this.currentPiece();
    const grid = this.grid();

    if (this.collisionService.canMoveDown(grid, current)) {
      current.move(0, 1);
      this.currentPiece.set(Tetromino.fromShape(current.type, { ...current.position }, current.shape));
    } else {
      this.lockTetromino();
    }
  }

  private lockTetromino(): void {
    let current = this.currentPiece();
    const grid = this.grid();

    const newGrid = grid.map((row) => [...row]);
    const { shape, position } = current;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newGrid[boardY][boardX] = 1;
          }
        }
      }
    }

    const filteredGrid = newGrid.filter((row) => row.some((cell) => cell === 0));
    const rowsCleared = 20 - filteredGrid.length;
    
    while (filteredGrid.length < 20) {
      filteredGrid.unshift(Array(10).fill(0));
    }
    
    this.grid.set(filteredGrid);

    if (rowsCleared > 0) {
      this.currentLines += rowsCleared;
      const points = this.calculateScore(rowsCleared);
      this.score.set(this.score() + points);
      this.lines.set(this.currentLines);
      this.level.set(Math.floor(this.currentLines / 10) + 1);
    }

    this.currentPiece.set(this.nextPiece());
    this.currentPiece().position = { x: SPAWN_X, y: SPAWN_Y };
    this.nextPiece.set(this.createPiece());

    if (!this.collisionService.canMoveDown(this.grid(), this.currentPiece())) {
      this.gameOver.set(true);
      this.status.set(GameStatus.GAME_OVER);
      this.stopInterval();
      return;
    }

    this.updateDropSpeed();
  }

  private calculateScore(cleared: number): number {
    const lvl = this.level();
    const baseScores = [0, 100, 300, 500, 800];
    return baseScores[cleared] * lvl;
  }

  private startInterval(): void {
    this.stopInterval();
    const speed = Math.max(100, 1000 - (this.level() - 1) * 100);
    this.intervalId = setInterval(() => this.moveDown(), speed);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateDropSpeed(): void {
    if (this.status() === GameStatus.RUNNING) {
      this.startInterval();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.move(Direction.LEFT);
        break;
      case 'ArrowRight':
        this.move(Direction.RIGHT);
        break;
      case 'ArrowDown':
        this.move(Direction.DOWN);
        break;
      case 'ArrowUp':
        this.rotate();
        break;
      case ' ':
        event.preventDefault();
        this.hardDrop();
        break;
      case 'p':
      case 'P':
        if (this.status() === GameStatus.RUNNING) {
          this.pauseGame();
        } else if (this.status() === GameStatus.PAUSED) {
          this.resumeGame();
        }
        break;
    }
  }
}
