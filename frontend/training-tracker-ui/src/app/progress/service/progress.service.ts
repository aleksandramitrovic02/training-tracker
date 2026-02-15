import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';
import { MonthlyProgressResponse } from '../../progress/progress.models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private base = `${environment.apiUrl}/api/progress`;

  constructor(private http: HttpClient) {}

  monthly(year: number, month: number) {
    return this.http.get<MonthlyProgressResponse>(`${this.base}/monthly?year=${year}&month=${month}`);
  }
}
