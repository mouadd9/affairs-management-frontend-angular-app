import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AgencyEmployee } from '../../model/Employee-details.interface';

@Component({
  selector: 'app-agency-employee-template',
  templateUrl: './agency-employee-template.component.html',
  styleUrl: './agency-employee-template.component.css'
})



export class AgencyEmployeeTemplateComponent implements OnInit{

  
  


  constructor(public authService: AuthService, 
    private router: Router,
  public userService: UsersService){} // we will inject the auth service so we can log out , and the routing service so we can rout to the login page 

  // here we need the id of this agency 
  // the only thing we have is the Username of our employee
  // so we should get the user by Username  
  logOut() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
    }

   ngOnInit(): void {
    console.log(this.authService.employee);
    
  }


}
