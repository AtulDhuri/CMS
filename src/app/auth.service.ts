import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  mobile: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl: string;
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    console.log('AuthService initialized with API URL:', this.apiUrl);
    this.updateAuthStatus();
  }

  get loginUrl(): string {
    return `${this.apiUrl}/auth/login`;
  }

  get registerUrl(): string {
    return `${this.apiUrl}/user`;
  }

  get refreshUrl(): string {
    return `${this.apiUrl}/auth/refresh`;
  }

  get userDetailsUrl(): string {
    return `${this.apiUrl}/user/me`;
  }

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  login(payload: LoginPayload): Observable<any> {
    console.log('Login request to:', this.loginUrl);
    return this.http.post(this.loginUrl, payload).pipe(
      tap((res: any) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.authStatusSubject.next(true);
      })
    );
  }

  register(payload: RegisterPayload): Observable<any> {
    console.log('Register request to:', this.registerUrl);
    return this.http.post(this.registerUrl, payload);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('Refresh token request to:', this.refreshUrl);
    return this.http.post(this.refreshUrl, { refreshToken }).pipe(
      tap((res: any) => {
        this.setTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.authStatusSubject.next(false);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (accessToken) {
      localStorage.setItem(this.accessTokenKey, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  getUserDetails(): Observable<any> {
    const token = this.getToken();
    if (!token) return of(null);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(this.userDetailsUrl, { headers }).pipe(
      catchError(() => of(null))
    );
  }

  private updateAuthStatus(): void {
    const isAuthenticated = this.hasValidToken();
    this.authStatusSubject.next(isAuthenticated);
    console.log('Auth status updated:', isAuthenticated);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }
} 