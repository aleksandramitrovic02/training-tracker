import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/enviroment';
import { Workout, CreateWorkoutRequest, UpdateWorkoutRequest, ExerciseType } from '../../workouts/workouts.models';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  private base = `${environment.apiUrl}/api/workouts`;

  constructor(private http: HttpClient) {}

  getExerciseTypes(): Observable<ExerciseType[]> {
    return this.http.get<ExerciseType[]>(`${this.base}/exercise-types`);
  }

  my(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.base}/my`);
  }

  create(req: CreateWorkoutRequest): Observable<Workout> {
    return this.http.post<Workout>(`${this.base}`, req);
  }

  update(id: string, req: UpdateWorkoutRequest): Observable<Workout> {
    return this.http.put<Workout>(`${this.base}/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
