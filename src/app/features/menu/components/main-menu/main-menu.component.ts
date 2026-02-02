import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  @Output() startGame = new EventEmitter<void>();

  constructor(private router: Router) {}

  onStartGame(): void {
    this.startGame.emit();
  }

  onHighScores(): void {
    this.router.navigate(['/high-scores']);
  }

  onSettings(): void {
    this.router.navigate(['/settings']);
  }
}
