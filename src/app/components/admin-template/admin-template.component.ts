import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {


  constructor(public authService: AuthService, private router: Router){} // we will inject the auth service so we can log out , and the routing service so we can rout to the login page 

  logOut() {
    this.authService.logout();
    }
 

}
