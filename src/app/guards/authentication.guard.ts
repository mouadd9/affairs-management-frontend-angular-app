import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate{

  constructor(private authService: AuthService, private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    console.log(this.authService.isAuthenticated);
    if (this.authService.isAuthenticated) {
      return true;
    } else {
      this.router.navigateByUrl("/login"); // Redirect to login if not authenticated
      return false; // Prevent access to the route
    }
  }
   

}
