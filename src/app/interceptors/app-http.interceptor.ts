import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

// this intercepts each request and adds the auth token to it, we do not intercept the authentication request

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.includes("/api/auth/login")) {

      const authReq = req.clone({

        setHeaders: {

          Authorization: `Bearer ${this.authService.access_token}`

        }

      });

      return next.handle(authReq);

    } else {

      return next.handle(req);

    }

  }

}

