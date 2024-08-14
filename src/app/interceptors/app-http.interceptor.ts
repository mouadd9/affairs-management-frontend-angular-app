import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

// this intercepts each request and adds the auth token to it, we do not intercept the authentication request

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.includes("/api/auth/login")) {

      const authReq = req.clone({

        setHeaders: {

          Authorization: `Bearer ${window.localStorage.getItem("jwt-token")}`

        }

      });

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

