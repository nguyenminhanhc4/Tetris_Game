import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="'cell ' + (filled ? 'filled' : 'empty')" [style.background-color]="color"></div>`,
  styles: [`
    .cell {
      width: 30px;
      height: 30px;
      border-radius: 4px;
    }
    .filled {
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    .empty {
      background: transparent;
    }
  `]
})
export class CellComponent {
  @Input() filled = false;
  @Input() color = '#5a5a8a';
}
