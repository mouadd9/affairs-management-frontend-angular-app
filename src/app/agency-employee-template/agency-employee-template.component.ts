import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency-employee-template',
  templateUrl: './agency-employee-template.component.html',
  styleUrl: './agency-employee-template.component.css'
})



export class AgencyEmployeeTemplateComponent {


  constructor(public authService: AuthService, private router: Router){} // we will inject the auth service so we can log out , and the routing service so we can rout to the login page 

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
    }
 

}
