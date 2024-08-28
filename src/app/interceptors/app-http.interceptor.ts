import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const AppHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  console.log('Interceptor called for URL:', req.url);
  
  if (!req.url.includes("/api/auth/login")) {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Modified request headers:', authReq.headers.get('Authorization'));
      
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authService.logout();
            // Optionally, redirect to login page
            // You might need to inject Router if you want to redirect here
          }
          return throwError(() => error);
        })
      );
    }
  }
  
  return next(req);
};


/*import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

// this intercepts each request and adds the auth token to it, we do not intercept the authentication request

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor called for URL:', req.url);

    if (!req.url.includes("/api/auth/login")) {

      const authReq = req.clone({

        setHeaders: {

          Authorization: `Bearer ${window.localStorage.getItem("jwt-token")}`

        }
      
      });
      console.log(authReq);

      return next.handle(authReq).pipe(
        catchError((error) => {
          // Handle token expiration or other errors
          if (error.status === 401) {
            this.authService.logout();
            // Optionally, redirect to login page
          }
          return throwError(() => new Error(`Failed to fetch data: ${error.message}`));
        })
      );

    } else {

      return next.handle(req);

    }

  }

}

*/