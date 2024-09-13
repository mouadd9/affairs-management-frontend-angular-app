import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable, switchMap, tap} from 'rxjs';

import { AffairDTO } from '../model/affair-dto.interface';
import { AffairsService } from '../services/affairs.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})

export class AgencyAffairsResolver implements Resolve<AffairDTO[]> {
  constructor(private affairsService: AffairsService,
    private authService:AuthService,
    private userService: UsersService
  ) {}
  resolve(): Observable<AffairDTO[]> {

    
    console.log("Info about the authenticated user:");
    console.log(this.authService.username);
    console.log(this.authService.roles);

    return this.userService.getEmployeeDetailsByUsername(this.authService.username).pipe(
      tap(employee => {
        this.authService.employee = employee;
        console.log("Authenticated employee:", this.authService.employee);
      }),
      switchMap(employee => this.affairsService.getAffairsByAgency(employee.agencyId))
    );

  
    
  }

}
