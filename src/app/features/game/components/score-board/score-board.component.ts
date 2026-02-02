import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  private gameService = inject(GameService);

  score = this.gameService.scoreValue;
  lines = this.gameService.linesValue;
  level = this.gameService.levelValue;
}
