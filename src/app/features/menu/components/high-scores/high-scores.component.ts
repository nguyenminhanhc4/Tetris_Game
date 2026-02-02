import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

interface HighScore {
  score: number;
  lines: number;
  level: number;
  date: Date;
}

@Component({
  selector: 'app-high-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './high-scores.component.html',
  styleUrl: './high-scores.component.scss',
})
export class HighScoresComponent implements OnInit {
  private storageService = inject(StorageService);
  private router = inject(Router);

  highScores: HighScore[] = [];

  ngOnInit(): void {
    this.loadHighScores();
  }

  loadHighScores(): void {
    const scores = this.storageService.getHighScores();
    this.highScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  clearScores(): void {
    this.storageService.clearHighScores();
    this.loadHighScores();
  }
}
