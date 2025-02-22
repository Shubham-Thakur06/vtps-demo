import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { InMemoryStorageService } from './in-memory-storage.service';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private inMemoryStorage: InMemoryStorageService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    // Validate credentials using InMemoryStorageService
    if (this.inMemoryStorage.validateLogin(username, password)) {
      const response: LoginResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          username: username,
          role: 'admin'
        }
      };

      return of(response).pipe(
        delay(1000),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
    }

    // Return error for invalid credentials
    return throwError(() => new Error('Invalid username or password'));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
} 