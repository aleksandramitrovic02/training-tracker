import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-progress-page',
  imports: [CommonModule],
  template: `
    <h2>Napredak</h2>
    <p>Sledeće pravimo prikaz po mesecu/nedeljama.</p>
  `
})
export class ProgressPage {}
