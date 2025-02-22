import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagersService {
  private apiUrl = `${environment.apiUrl}/managers`;

  constructor(private http: HttpClient) {}

  getManagers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addManager(manager: any): Observable<any> {
    return this.http.post(this.apiUrl, manager);
  }

  updateManager(id: number, manager: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, manager);
  }

  resetPassword(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reset-password`, {});
  }
} 