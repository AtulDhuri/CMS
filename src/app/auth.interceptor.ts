import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { environment } from '../environments/environment';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

const addTokenHeader = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getToken();

  // Exclude login and register requests
  if (req.url.includes(`${environment.apiUrl}/auth/login`) || req.url.includes(`${environment.apiUrl}/auth/register`)) {
    return next(req);
  }

  if (authToken) {
    req = addTokenHeader(req, authToken);
  }

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        error.error?.message === 'Token has expired'
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((token: any) => {
              isRefreshing = false;
              refreshTokenSubject.next(token.accessToken);
              return next(addTokenHeader(req, token.accessToken));
            }),
            catchError((err) => {
              isRefreshing = false;
              if (err instanceof HttpErrorResponse && err.status === 403) {
                authService.logout();
                router.navigate(['/login']);
              }
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((jwt) => next(addTokenHeader(req, jwt)))
          );
        }
      }

      return throwError(() => error);
    })
  );
}; 