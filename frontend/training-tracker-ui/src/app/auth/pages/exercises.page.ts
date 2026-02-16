import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-exercises-page',
  imports: [CommonModule],
  template: `
    <h2>Exercises</h2>
    <p>Next: CRUD and backend integration.</p>
  `
})
export class ExercisesPage {}
