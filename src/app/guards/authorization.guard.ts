import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate{

  constructor(private authService: AuthService, private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
   
   
    if (this.authService.isAuthenticated) {

      const requiredRoles: string[] = route.data['roles'] || [];
      const userRoles: string[] = this.authService.roles || [];
      console.log("Required roles:", requiredRoles);
      console.log("User roles:", userRoles);
      console.log("Session status:", this.authService.isAuthenticated);
      
      if (requiredRoles.some(role => userRoles.includes(role))) {
        return true;
      } else {
        console.warn("Unauthorized access - redirecting to login");
        this.router.navigateByUrl("/login");
        return false;
      }
    } else {
      console.warn("Not authenticated - redirecting to login");
      this.router.navigateByUrl("/login");
      return false;
    }
   

}       
}
