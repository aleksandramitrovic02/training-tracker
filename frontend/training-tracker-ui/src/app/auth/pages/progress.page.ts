import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-progress-page',
  imports: [CommonModule],
  template: `
    <h2>Progress</h2>
    <p>Next: monthly/weekly view.</p>
  `
})
export class ProgressPage {}
