import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable} from 'rxjs';

import { UsersService } from '../services/users.service'; // Adjust the path as needed
import { UserCounts } from '../model/userCounts.model';

@Injectable({
  providedIn: 'root'
})

export class userCountsResolver implements Resolve<UserCounts> {
  constructor(private usersService: UsersService) {}
  resolve(): Observable<UserCounts> {
    return this.usersService.getUserCounts();
  }

}
