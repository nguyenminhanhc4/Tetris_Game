import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-over-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-over-dialog.component.html',
  styleUrl: './game-over-dialog.component.scss',
})
export class GameOverDialogComponent {
  @Input() score = 0;
  @Input() lines = 0;
  @Input() level = 1;
  @Output() restart = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }
}
