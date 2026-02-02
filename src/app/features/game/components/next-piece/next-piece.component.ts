import { Component, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-next-piece',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-piece.component.html',
  styleUrl: './next-piece.component.scss',
})
export class NextPieceComponent {
  private gameService = inject(GameService);

  @ViewChild('previewCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private lastDrawState = '';

  constructor() {
    effect(() => {
      const nextPiece = this.gameService.nextTetromino();
      const state = JSON.stringify(nextPiece);
      if (state !== this.lastDrawState) {
        this.lastDrawState = state;
        this.draw();
      }
    });
  }

  private draw(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tetromino = this.gameService.nextTetromino();
    if (tetromino) {
      this.drawTetromino(ctx, tetromino);
    }
  }

  private drawTetromino(ctx: CanvasRenderingContext2D, tetromino: { shape: number[][]; type: string }): void {
    const cellSize = 20;
    const { shape, type } = tetromino;

    const offsetX = (120 - shape[0].length * cellSize) / 2;
    const offsetY = (120 - shape.length * cellSize) / 2;

    ctx.fillStyle = this.getTetrominoColor(type);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          ctx.fillRect(
            offsetX + x * cellSize,
            offsetY + y * cellSize,
            cellSize - 1,
            cellSize - 1
          );
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
