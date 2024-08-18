import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { UserDTO } from '../model/user.model';  // Adjust the path as needed
import { UsersService } from '../services/users.service'; // Adjust the path as needed
import { AgencyCounts } from '../model/agencyCounts.model';

@Injectable({
  providedIn: 'root'
})

export class AgencyDataResolver implements Resolve<AgencyCounts> {
  constructor(private usersService: UsersService) {}
  resolve(): Observable<AgencyCounts> {
    return this.usersService.getAgencyCounts();
  }

}
