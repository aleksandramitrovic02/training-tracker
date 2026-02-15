import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-exercises-page',
  imports: [CommonModule],
  template: `
    <h2>Vežbe</h2>
    <p>Sledeće pravimo CRUD i povezivanje sa backendom.</p>
  `
})
export class ExercisesPage {}
