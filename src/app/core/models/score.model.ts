export class Score {
  points = 0;
  lines = 0;
  level = 1;

  private static readonly LINE_SCORE = [0, 100, 300, 500, 800];
  private static readonly LINES_PER_LEVEL = 10;

  addClearedLines(count: number): void {
    if (count < 0 || count > 4) return;

    this.lines += count;
    this.points += Score.LINE_SCORE[count] * this.level;

    this.updateLevel();
  }

  private updateLevel(): void {
    this.level = Math.floor(this.lines / Score.LINES_PER_LEVEL) + 1;
  }

  reset(): void {
    this.points = 0;
    this.lines = 0;
    this.level = 1;
  }
}
