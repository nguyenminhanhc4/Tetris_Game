import { Injectable } from '@angular/core';

export interface HighScoreEntry {
  score: number;
  lines: number;
  level: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'tetris_high_scores';
  private readonly MAX_SCORES = 10;

  getHighScores(): HighScoreEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
    } catch {
      return [];
    }
  }

  saveScore(score: number, lines: number, level: number): void {
    const currentScores = this.getHighScores();
    const newEntry: HighScoreEntry = {
      score,
      lines,
      level,
      date: new Date(),
    };

    currentScores.push(newEntry);
    currentScores.sort((a, b) => b.score - a.score);
    const topScores = currentScores.slice(0, this.MAX_SCORES);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));
  }

  clearHighScores(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    if (scores.length < this.MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
  }
}
