import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';
import { Workout, CreateWorkoutRequest, UpdateWorkoutRequest } from '../../workouts/workouts.models';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  private base = `${environment.apiUrl}/api/workouts`;

  constructor(private http: HttpClient) {}

  my() {
    return this.http.get<Workout[]>(`${this.base}/my`);
  }

  create(req: CreateWorkoutRequest) {
    return this.http.post<Workout>(`${this.base}`, req);
  }

  update(id: string, req: UpdateWorkoutRequest) {
    return this.http.put<Workout>(`${this.base}/${id}`, req);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
