import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/enviroment';
import { Exercise, CreateExerciseRequest, UpdateExerciseRequest } from '../../exercises/exercises.models';

@Injectable({ providedIn: 'root' })
export class ExercisesService {
  private base = `${environment.apiUrl}/api/exercises`;

  constructor(private http: HttpClient) {}

  my(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.base);
  }

  create(req: CreateExerciseRequest): Observable<Exercise> {
    return this.http.post<Exercise>(this.base, req);
  }

  update(id: string, req: UpdateExerciseRequest): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.base}/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
