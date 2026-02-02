import { Component, HostListener, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStatus } from '../../../../core/enums/game-status.enum';
import { ScoreBoardComponent } from '../score-board/score-board.component';
import { NextPieceComponent } from '../next-piece/next-piece.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [
    CommonModule,
    ScoreBoardComponent,
    NextPieceComponent,
    GameControlsComponent,
    GameOverDialogComponent,
  ],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss',
})
export class GameContainerComponent {
  private gameService = inject(GameService);

  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly GameStatus = GameStatus;
  protected readonly gameServiceRef = this.gameService;

  private lastDrawState = '';

  constructor() {
    effect(() => {
      const board = this.gameService.board();
      const piece = this.gameService.currentTetromino();
      const status = this.gameService.status();

      const state = JSON.stringify({ board, piece, status });
      if (state !== this.lastDrawState) {
        this.lastDrawState = state;
        this.draw();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.gameService.handleKeyDown(event);
  }

  startGame(): void {
    this.gameService.startGame();
  }

  pauseGame(): void {
    this.gameService.pauseGame();
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  draw(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawGrid(ctx);
    this.drawCurrentPiece(ctx);
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    const grid = this.gameService.board();
    const cellSize = 30;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 1) {
          ctx.fillStyle = '#5a5a8a';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  private drawCurrentPiece(ctx: CanvasRenderingContext2D): void {
    const tetromino = this.gameService.currentTetromino();
    if (!tetromino) return;

    const cellSize = 30;
    const { shape, position, type } = tetromino;

    ctx.fillStyle = this.getTetrominoColor(type);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const drawX = (position.x + x) * cellSize;
          const drawY = (position.y + y) * cellSize;
          ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  private getTetrominoColor(type: string): string {
    const colors: Record<string, string> = {
      'I': '#00f0f0',
      'O': '#f0f000',
      'T': '#a000f0',
      'L': '#f0a000',
      'J': '#0000f0',
      'S': '#00f000',
      'Z': '#f00000',
    };
    return colors[type] || '#ffffff';
  }
}
