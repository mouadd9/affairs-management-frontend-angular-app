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

      console.log('AuthorizationGuard triggered');
      const requiredRoles: string[] = route.data['roles'] || [];
      const userRoles: string[] = this.authService.roles || [];
      console.log("Required roles:", requiredRoles);
      console.log("User roles:", userRoles);
      console.log("Session status:", this.authService.isAuthenticated);
      const logMessage = `AuthGuard Check - URL: ${state.url}, Auth: ${this.authService.isAuthenticated}, Roles: ${this.authService.roles}`;
      localStorage.setItem('lastAuthGuardLog', logMessage);

      
      if (requiredRoles.some(role => userRoles.includes(role))) {
        return true;
      } else {
        console.warn("Unauthorized access - redirecting to login");
        // Redirect to a specific route for unauthorized access
      this.router.navigateByUrl("/unauthorized");
      return false;
      }
    } else {
      console.warn("Not authenticated - redirecting to login");
      this.router.navigateByUrl("/login");
      return false;
    }
   

}       
}
