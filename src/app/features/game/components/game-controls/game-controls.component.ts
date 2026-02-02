import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Direction } from '../../../../core/enums/direction.enum';
import { GameStatus } from '../../../../core/enums/game-status.enum';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent {
  private gameService = inject(GameService);

  protected readonly Direction = Direction;
  protected readonly GameStatus = GameStatus;

  move(direction: Direction): void {
    this.gameService.move(direction);
  }

  rotate(): void {
    this.gameService.rotate();
  }

  hardDrop(): void {
    this.gameService.hardDrop();
  }

  pause(): void {
    this.gameService.pauseGame();
  }

  resume(): void {
    this.gameService.resumeGame();
  }

  reset(): void {
    this.gameService.resetGame();
  }
}
