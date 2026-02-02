import { Injectable } from '@angular/core';
import { Score } from '../../../core/models/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  private readonly LINE_SCORES = [0, 100, 300, 500, 800];
  private readonly LINES_PER_LEVEL = 10;
  private readonly LEVEL_MULTIPLIER = 1.5;

  calculateScore(clearedLines: number, level: number): number {
    if (clearedLines < 1 || clearedLines > 4) return 0;
    return this.LINE_SCORES[clearedLines] * level;
  }

  calculateLevel(totalLines: number): number {
    return Math.floor(totalLines / this.LINES_PER_LEVEL) + 1;
  }

  calculateDropSpeed(level: number): number {
    return Math.max(100, 1000 - (level - 1) * 100);
  }
}
